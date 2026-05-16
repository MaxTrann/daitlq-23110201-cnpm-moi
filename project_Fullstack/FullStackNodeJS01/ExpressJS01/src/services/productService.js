const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const MedicineDetail = require("../models/medicineDetail");
const ProductBatch = require("../models/productBatch");
const { createSlug } = require("./slugService");
const { applyDrugDefaults } = require("../constants/medcare");
const { buildProductProjection } = require("./catalog/productMapper");

const productPopulate = [
    { path: "category" },
    { path: "brandId", select: "name slug logo country" },
    { path: "medicineDetail" }
];

const buildCategoryFilter = async (categoryInput, isAdmin = false) => {
    if (!categoryInput) {
        return null;
    }
    if (mongoose.Types.ObjectId.isValid(categoryInput)) {
        return categoryInput;
    }
    const category = await Category.findOne({
        slug: categoryInput,
        ...(isAdmin ? {} : { isActive: true })
    });
    return category?._id || "__EMPTY__";
};

const upsertMedicineDetail = async (productId, payload, productType) => {
    if (!payload) {
        return;
    }
    const hasMedicineType = ["medicine_otc", "medicine_rx", "functional_food"].includes(productType);
    if (!hasMedicineType && !payload.activeIngredient) {
        return;
    }

    await MedicineDetail.findOneAndUpdate(
        { productId },
        {
            productId,
            activeIngredient: payload.activeIngredient || "",
            registrationNo: payload.registrationNo || "",
            dosageForm: payload.dosageForm || "other",
            concentration: payload.concentration || "",
            indications: payload.indications || "",
            usage: payload.usage || "",
            contraindications: payload.contraindications || "",
            sideEffects: payload.sideEffects || "",
            warnings: payload.warnings || "",
            storage: payload.storage || "",
            prescriptionRequired: productType === "medicine_rx"
        },
        { upsert: true, new: true }
    );
};

const getCategoriesService = async () => {
    return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

const getAdminCategoriesService = async (query) => {
    const filters = {};
    if (query.keyword) {
        filters.name = { $regex: query.keyword, $options: "i" };
    }
    if (query.status === "active") {
        filters.isActive = true;
    }
    if (query.status === "inactive") {
        filters.isActive = false;
    }
    if (query.categoryKind) {
        filters.categoryKind = query.categoryKind;
    }
    return Category.find(filters).sort({ sortOrder: 1, createdAt: -1 });
};

const getCategoryByIdService = async (id) => Category.findById(id);

const createCategoryService = async (payload) => {
    const slug = createSlug(payload.slug || payload.name);
    const existing = await Category.findOne({ slug });
    if (existing) {
        return { success: false, message: "Danh mục đã tồn tại" };
    }
    const category = await Category.create({
        name: payload.name,
        slug,
        description: payload.description || "",
        parentId: payload.parentId || null,
        categoryKind: payload.categoryKind || "medicine",
        icon: payload.icon || "",
        sortOrder: payload.sortOrder ?? 0,
        isActive: payload.isActive !== false
    });
    return { success: true, data: category };
};

const updateCategoryService = async (id, payload) => {
    const category = await Category.findById(id);
    if (!category) {
        return { success: false, message: "Danh mục không tồn tại" };
    }
    const slug = createSlug(payload.slug || payload.name || category.name);
    const duplicate = await Category.findOne({ slug, _id: { $ne: id } });
    if (duplicate) {
        return { success: false, message: "Slug danh mục đã tồn tại" };
    }
    category.name = payload.name ?? category.name;
    category.slug = slug;
    category.description = payload.description ?? category.description;
    category.parentId = payload.parentId ?? category.parentId;
    category.categoryKind = payload.categoryKind ?? category.categoryKind;
    category.icon = payload.icon ?? category.icon;
    if (payload.sortOrder !== undefined) {
        category.sortOrder = payload.sortOrder;
    }
    if (typeof payload.isActive === "boolean") {
        category.isActive = payload.isActive;
    }
    await category.save();
    return { success: true, data: category };
};

const deleteCategoryService = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
        return { success: false, message: "Danh mục không tồn tại" };
    }
    category.isActive = false;
    await category.save();
    await Product.updateMany({ category: category._id }, { isActive: false });
    return { success: true, data: category };
};

const applyProductFilters = (query, filters) => {
    const { keyword, category, minPrice, maxPrice, stockStatus, isSale, sort, productType, drugClass, brand, onlineOnly } = query;

    if (keyword) {
        filters.$or = [
            { name: { $regex: keyword, $options: "i" } },
            { sku: { $regex: keyword, $options: "i" } },
            { shortDescription: { $regex: keyword, $options: "i" } }
        ];
    }

    if (productType) {
        filters.productType = productType;
    }
    if (drugClass) {
        filters.drugClass = drugClass;
    }
    if (onlineOnly === "true" || onlineOnly === true) {
        filters.allowedOnlineSale = true;
    }
    if (isSale === "true" || isSale === true) {
        filters.isSale = true;
    }
    if (stockStatus === "in-stock") {
        filters.stock = { $gt: 0 };
    }
    if (stockStatus === "out-of-stock") {
        filters.stock = 0;
    }

    return { minPrice, maxPrice, sort, brand };
};

const getProductsService = async (query) => {
    const filters = { isActive: true };
    const { minPrice, maxPrice, sort, brand } = applyProductFilters(query, filters);

    const categoryId = await buildCategoryFilter(query.category, false);
    if (categoryId === "__EMPTY__") {
        return [];
    }
    if (categoryId) {
        filters.category = categoryId;
    }

    if (brand) {
        const Brand = require("../models/brand");
        const brandDoc = mongoose.Types.ObjectId.isValid(brand)
            ? await Brand.findById(brand)
            : await Brand.findOne({ slug: brand, isActive: true });
        if (!brandDoc) {
            return [];
        }
        filters.brandId = brandDoc._id;
    }

    let products = await Product.find(filters)
        .populate(productPopulate)
        .sort({ createdAt: -1 });

    products = products.filter((product) => {
        if (!product.category || !product.category.isActive) {
            return false;
        }
        const currentPrice = product.salePrice || product.price;
        if (minPrice && currentPrice < Number(minPrice)) {
            return false;
        }
        if (maxPrice && currentPrice > Number(maxPrice)) {
            return false;
        }
        return true;
    });

    switch (sort) {
        case "best-selling":
            products.sort((a, b) => b.sold - a.sold);
            break;
        case "price-asc":
            products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
            break;
        case "price-desc":
            products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
            break;
        case "newest":
        default:
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    return products.map((item) => buildProductProjection(item));
};

const getAdminProductsService = async (query) => {
    const filters = {};
    applyProductFilters(query, filters);

    if (query.status === "active") {
        filters.isActive = true;
    }
    if (query.status === "inactive") {
        filters.isActive = false;
    }

    const categoryId = await buildCategoryFilter(query.category, true);
    if (categoryId === "__EMPTY__") {
        return [];
    }
    if (categoryId) {
        filters.category = categoryId;
    }

    const products = await Product.find(filters)
        .populate(productPopulate)
        .sort({ createdAt: -1 });

    return products.map((item) => buildProductProjection(item));
};

const getProductDetailService = async (productId) => {
    const product = await Product.findOne({
        _id: productId,
        isActive: true
    }).populate([
        { path: "category", match: { isActive: true } },
        { path: "brandId", select: "name slug logo country" },
        { path: "medicineDetail" }
    ]);

    if (!product || !product.category) {
        return null;
    }

    const batches = await ProductBatch.find({
        productId: product._id,
        isActive: true,
        expiryDate: { $gte: new Date() }
    }).sort({ expiryDate: 1 });

    return {
        ...buildProductProjection(product),
        batches
    };
};

const normalizeProductPayload = (payload) => {
    const productType = payload.productType || "medicine_otc";
    const drugDefaults = applyDrugDefaults(productType);

    return {
        productType,
        drugClass: payload.drugClass || drugDefaults.drugClass,
        allowedOnlineSale: typeof payload.allowedOnlineSale === "boolean"
            ? payload.allowedOnlineSale
            : drugDefaults.allowedOnlineSale
    };
};

const createProductService = async (payload) => {
    const category = await Category.findById(payload.category);
    if (!category) {
        return { success: false, message: "Danh mục không tồn tại" };
    }

    const slug = createSlug(payload.slug || payload.name);
    const duplicateSlug = await Product.findOne({ slug });
    if (duplicateSlug) {
        return { success: false, message: "Slug sản phẩm đã tồn tại" };
    }

    if (payload.sku) {
        const duplicateSku = await Product.findOne({ sku: payload.sku });
        if (duplicateSku) {
            return { success: false, message: "SKU đã tồn tại" };
        }
    }

    const drugMeta = normalizeProductPayload(payload);

    const product = await Product.create({
        name: payload.name,
        slug,
        sku: payload.sku || `MED-${Date.now()}`,
        barcode: payload.barcode || "",
        shortDescription: payload.shortDescription || "",
        description: payload.description || "",
        price: payload.price,
        salePrice: payload.salePrice || null,
        images: payload.images || [],
        stock: payload.stock || 0,
        sold: payload.sold || 0,
        category: payload.category,
        brandId: payload.brandId || null,
        unitLabel: payload.unitLabel || "Hộp",
        packagingDescription: payload.packagingDescription || "",
        requiresPharmacistAdvice: payload.requiresPharmacistAdvice === true,
        isNew: payload.isNew === true,
        isBestSeller: payload.isBestSeller === true,
        isSale: payload.isSale === true,
        isActive: payload.isActive !== false,
        ...drugMeta
    });

    await upsertMedicineDetail(product._id, payload.medicineDetail, drugMeta.productType);

    const data = await Product.findById(product._id).populate(productPopulate);
    return { success: true, data: buildProductProjection(data) };
};

const updateProductService = async (id, payload) => {
    const product = await Product.findById(id);
    if (!product) {
        return { success: false, message: "Sản phẩm không tồn tại" };
    }

    if (payload.category) {
        const category = await Category.findById(payload.category);
        if (!category) {
            return { success: false, message: "Danh mục không tồn tại" };
        }
    }

    const slug = createSlug(payload.slug || payload.name || product.name);
    const duplicateSlug = await Product.findOne({ slug, _id: { $ne: id } });
    if (duplicateSlug) {
        return { success: false, message: "Slug sản phẩm đã tồn tại" };
    }

    if (payload.sku && payload.sku !== product.sku) {
        const duplicateSku = await Product.findOne({ sku: payload.sku, _id: { $ne: id } });
        if (duplicateSku) {
            return { success: false, message: "SKU đã tồn tại" };
        }
    }

    const productType = payload.productType || product.productType;
    const drugMeta = payload.productType
        ? normalizeProductPayload({ ...payload, productType })
        : null;

    product.name = payload.name ?? product.name;
    product.slug = slug;
    product.sku = payload.sku ?? product.sku;
    product.barcode = payload.barcode ?? product.barcode;
    product.shortDescription = payload.shortDescription ?? product.shortDescription;
    product.description = payload.description ?? product.description;
    product.price = payload.price ?? product.price;
    product.salePrice = payload.salePrice === "" ? null : (payload.salePrice ?? product.salePrice);
    product.images = payload.images ?? product.images;
    product.stock = payload.stock ?? product.stock;
    product.sold = payload.sold ?? product.sold;
    product.category = payload.category ?? product.category;
    product.brandId = payload.brandId === "" ? null : (payload.brandId ?? product.brandId);
    product.unitLabel = payload.unitLabel ?? product.unitLabel;
    product.packagingDescription = payload.packagingDescription ?? product.packagingDescription;

    if (drugMeta) {
        product.productType = drugMeta.productType;
        product.drugClass = payload.drugClass || drugMeta.drugClass;
        product.allowedOnlineSale = typeof payload.allowedOnlineSale === "boolean"
            ? payload.allowedOnlineSale
            : drugMeta.allowedOnlineSale;
    } else if (typeof payload.allowedOnlineSale === "boolean") {
        product.allowedOnlineSale = payload.allowedOnlineSale;
    }

    if (typeof payload.requiresPharmacistAdvice === "boolean") {
        product.requiresPharmacistAdvice = payload.requiresPharmacistAdvice;
    }
    if (typeof payload.isNew === "boolean") {
        product.isNew = payload.isNew;
    }
    if (typeof payload.isBestSeller === "boolean") {
        product.isBestSeller = payload.isBestSeller;
    }
    if (typeof payload.isSale === "boolean") {
        product.isSale = payload.isSale;
    }
    if (typeof payload.isActive === "boolean") {
        product.isActive = payload.isActive;
    }

    await product.save();
    await upsertMedicineDetail(product._id, payload.medicineDetail, product.productType);

    const data = await Product.findById(product._id).populate(productPopulate);
    return { success: true, data: buildProductProjection(data) };
};

const deleteProductService = async (id) => {
    const product = await Product.findById(id);
    if (!product) {
        return { success: false, message: "Sản phẩm không tồn tại" };
    }
    product.isActive = false;
    await product.save();
    return { success: true, data: product };
};

module.exports = {
    getCategoriesService,
    getAdminCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
    getProductsService,
    getAdminProductsService,
    getProductDetailService,
    createProductService,
    updateProductService,
    deleteProductService
};

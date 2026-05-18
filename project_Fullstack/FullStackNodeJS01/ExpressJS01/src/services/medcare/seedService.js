const Product = require("../../models/product");
const Category = require("../../models/category");
const Brand = require("../../models/brand");
const MedicineDetail = require("../../models/medicineDetail");
const ProductBatch = require("../../models/productBatch");
const { createSlug } = require("../slugService");
const { applyDrugDefaults } = require("../../constants/medcare");
const { categorySeedData, brandSeedData, productSeedData } = require("./seedData");

const shouldResetCatalog = async () => {
    if (process.env.MEDCARE_RESET_CATALOG === "true") {
        return true;
    }
    const medCareProduct = await Product.findOne({ sku: /^MED-/ });
    return !medCareProduct;
};

const clearCatalog = async () => {
    await ProductBatch.deleteMany({});
    await MedicineDetail.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    console.log(">>> MedCare: đã xóa dữ liệu catalog cũ");
};

const seedCategories = async () => {
    const map = {};
    for (const item of categorySeedData) {
        const doc = await Category.create({
            ...item,
            isActive: true
        });
        map[item.slug] = doc;
    }
    return map;
};

const seedBrands = async () => {
    const map = {};
    for (const item of brandSeedData) {
        const doc = await Brand.create({
            ...item,
            isActive: true
        });
        map[item.slug] = doc;
    }
    return map;
};

const seedProducts = async (categoryMap, brandMap) => {
    for (const item of productSeedData) {
        const category = categoryMap[item.categorySlug];
        const brand = brandMap[item.brandSlug];
        if (!category) {
            continue;
        }

        const drugDefaults = applyDrugDefaults(item.productType);
        const slug = createSlug(item.name);

        const product = await Product.create({
            name: item.name,
            slug,
            sku: item.sku,
            shortDescription: item.shortDescription || "",
            description: item.description || "",
            price: item.price,
            salePrice: item.salePrice ?? null,
            images: item.images || [],
            stock: item.stock ?? 0,
            sold: item.sold ?? 0,
            viewCount: item.viewCount ?? Math.max((item.sold ?? 0) * 3, 100),
            category: category._id,
            brandId: brand?._id || null,
            productType: item.productType,
            drugClass: drugDefaults.drugClass,
            allowedOnlineSale: item.allowedOnlineSale ?? drugDefaults.allowedOnlineSale,
            requiresPharmacistAdvice: item.requiresPharmacistAdvice ?? false,
            unitLabel: item.unitLabel || "Hộp",
            packagingDescription: item.packagingDescription || "",
            isNew: item.isNew ?? false,
            isBestSeller: item.isBestSeller ?? false,
            isSale: item.isSale ?? false,
            isActive: true
        });

        if (item.medicineDetail) {
            await MedicineDetail.create({
                productId: product._id,
                ...item.medicineDetail,
                prescriptionRequired: item.productType === "medicine_rx"
            });
        }

        if (item.batch) {
            await ProductBatch.create({
                productId: product._id,
                batchCode: item.batch.batchCode,
                expiryDate: new Date(item.batch.expiryDate),
                quantity: item.batch.quantity,
                isActive: true
            });
        }
    }
};

const ensureMedCareCatalog = async () => {
    try {
        const reset = await shouldResetCatalog();
        if (!reset) {
            console.log(">>> MedCare catalog: đã có dữ liệu, bỏ qua seed");
            return;
        }

        await clearCatalog();
        const categoryMap = await seedCategories();
        const brandMap = await seedBrands();
        await seedProducts(categoryMap, brandMap);
        console.log(">>> MedCare catalog: seed hoàn tất");
    } catch (error) {
        console.log(">>> MedCare seed error:", error);
        throw error;
    }
};

module.exports = {
    ensureMedCareCatalog,
    clearCatalog
};

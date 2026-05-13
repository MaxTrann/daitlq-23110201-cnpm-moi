const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const { createSlug } = require("./slugService");

const categorySeedData = [
    {
        name: "Giày Sneaker",
        slug: "giay-sneaker",
        description: "Các mẫu sneaker dễ phối đồ hằng ngày.",
        isActive: true
    },
    {
        name: "Thời trang",
        slug: "thoi-trang",
        description: "Quần áo và phụ kiện theo xu hướng trẻ.",
        isActive: true
    },
    {
        name: "Phụ kiện",
        slug: "phu-kien",
        description: "Các sản phẩm nhỏ gọn, tiện dụng.",
        isActive: true
    },
    {
        name: "Lifestyle",
        slug: "lifestyle",
        description: "Sản phẩm phục vụ cuộc sống năng động.",
        isActive: true
    }
];

const productSeedData = [
    {
        name: "Nike Air Daily",
        description: "Mẫu sneaker đi học, đi chơi, phối tốt với quần jeans và áo thun. Form gọn, đế êm, phù hợp cho sinh viên.",
        price: 1490000,
        salePrice: 1190000,
        images: [
            "https://picsum.photos/seed/nike-air-daily-1/900/700",
            "https://picsum.photos/seed/nike-air-daily-2/900/700",
            "https://picsum.photos/seed/nike-air-daily-3/900/700"
        ],
        stock: 18,
        sold: 120,
        categorySlug: "giay-sneaker",
        isNew: true,
        isBestSeller: true,
        isSale: true,
        isActive: true
    },
    {
        name: "Urban Runner Pro",
        description: "Giày chạy bộ đế nhẹ, ôm chân, bám tốt, thích hợp cho việc tập luyện và đi bộ hằng ngày.",
        price: 1790000,
        salePrice: null,
        images: [
            "https://picsum.photos/seed/urban-runner-pro-1/900/700",
            "https://picsum.photos/seed/urban-runner-pro-2/900/700"
        ],
        stock: 10,
        sold: 84,
        categorySlug: "giay-sneaker",
        isNew: true,
        isBestSeller: false,
        isSale: false,
        isActive: true
    },
    {
        name: "Basic Hoodie Campus",
        description: "Áo hoodie form rộng, chất nỉ mềm, giữ ấm vừa phải cho phòng học máy lạnh và đi học buổi tối.",
        price: 690000,
        salePrice: 590000,
        images: [
            "https://picsum.photos/seed/basic-hoodie-campus-1/900/700",
            "https://picsum.photos/seed/basic-hoodie-campus-2/900/700"
        ],
        stock: 25,
        sold: 61,
        categorySlug: "thoi-trang",
        isNew: false,
        isBestSeller: true,
        isSale: true,
        isActive: true
    },
    {
        name: "Relaxed Cargo Pants",
        description: "Quần cargo túi hộp, chất vải dày, phối tốt với sneaker và hoodie, hợp phong cách streetwear cơ bản.",
        price: 820000,
        salePrice: null,
        images: [
            "https://picsum.photos/seed/relaxed-cargo-pants-1/900/700",
            "https://picsum.photos/seed/relaxed-cargo-pants-2/900/700"
        ],
        stock: 14,
        sold: 45,
        categorySlug: "thoi-trang",
        isNew: false,
        isBestSeller: false,
        isSale: false,
        isActive: true
    },
    {
        name: "Mini Crossbody Bag",
        description: "Túi đeo chéo nhỏ gọn, đựng iPad mini, sách vở và các đồ dùng cần thiết. Hợp cho đi học và đi cà phê.",
        price: 450000,
        salePrice: 390000,
        images: [
            "https://picsum.photos/seed/mini-crossbody-bag-1/900/700",
            "https://picsum.photos/seed/mini-crossbody-bag-2/900/700"
        ],
        stock: 35,
        sold: 93,
        categorySlug: "phu-kien",
        isNew: true,
        isBestSeller: true,
        isSale: true,
        isActive: true
    },
    {
        name: "Smart Bottle 650ml",
        description: "Bình nước giữ lạnh có tay xách, phù hợp cho việc đi học, đi tập và sử dụng cả ngày.",
        price: 320000,
        salePrice: null,
        images: [
            "https://picsum.photos/seed/smart-bottle-650-1/900/700",
            "https://picsum.photos/seed/smart-bottle-650-2/900/700"
        ],
        stock: 40,
        sold: 51,
        categorySlug: "lifestyle",
        isNew: false,
        isBestSeller: false,
        isSale: false,
        isActive: true
    },
    {
        name: "Daily Office Backpack",
        description: "Balo ngăn chống sốc cho laptop 15 inch, ngăn phụ cho sạc, chuột, sách vở. Màu sắc trung tính dễ dùng.",
        price: 980000,
        salePrice: 850000,
        images: [
            "https://picsum.photos/seed/daily-office-backpack-1/900/700",
            "https://picsum.photos/seed/daily-office-backpack-2/900/700",
            "https://picsum.photos/seed/daily-office-backpack-3/900/700"
        ],
        stock: 7,
        sold: 76,
        categorySlug: "phu-kien",
        isNew: false,
        isBestSeller: true,
        isSale: true,
        isActive: true
    },
    {
        name: "Slip-On Weekend",
        description: "Giày slip-on dễ đi nhanh, phù hợp cho các chuyến đi ngắn, chần đế êm và phong cách tối giản.",
        price: 890000,
        salePrice: 760000,
        images: [
            "https://picsum.photos/seed/slip-on-weekend-1/900/700",
            "https://picsum.photos/seed/slip-on-weekend-2/900/700"
        ],
        stock: 0,
        sold: 68,
        categorySlug: "giay-sneaker",
        isNew: false,
        isBestSeller: false,
        isSale: true,
        isActive: true
    },
    {
        name: "Desk Light Minimal",
        description: "Đèn học tập thiết kế gọn, ánh sáng dễ chịu, phù hợp cho góc học bài và bàn làm việc tại nhà.",
        price: 560000,
        salePrice: null,
        images: [
            "https://picsum.photos/seed/desk-light-minimal-1/900/700",
            "https://picsum.photos/seed/desk-light-minimal-2/900/700"
        ],
        stock: 12,
        sold: 28,
        categorySlug: "lifestyle",
        isNew: true,
        isBestSeller: false,
        isSale: false,
        isActive: true
    },
    {
        name: "Oversize Tee Mono",
        description: "Áo thun oversize in chữ tối giản, vải dày, mặc mát, hợp để phối với cargo và sneaker.",
        price: 350000,
        salePrice: 299000,
        images: [
            "https://picsum.photos/seed/oversize-tee-mono-1/900/700",
            "https://picsum.photos/seed/oversize-tee-mono-2/900/700"
        ],
        stock: 31,
        sold: 59,
        categorySlug: "thoi-trang",
        isNew: true,
        isBestSeller: true,
        isSale: true,
        isActive: true
    }
];

const buildProductProjection = (product) => {
    const item = product.toObject ? product.toObject() : product;

    return {
        ...item,
        currentPrice: item.salePrice || item.price
    };
};

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

const ensureCategorySeedData = async () => {
    const currentCategories = await Category.find({});
    if (currentCategories.length === 0) {
        await Category.insertMany(categorySeedData);
        return await Category.find({});
    }

    for (const item of categorySeedData) {
        const existing = currentCategories.find((category) => category.slug === item.slug);
        if (!existing) {
            await Category.create(item);
        }
    }

    return await Category.find({});
};

const migrateOldProductsToCategoryRefs = async (categories) => {
    const products = await Product.find({});
    for (const product of products) {
        let shouldUpdate = false;
        const updatePayload = {};

        if (!product.slug) {
            updatePayload.slug = createSlug(product.name);
            shouldUpdate = true;
        }

        if (typeof product.category === "string") {
            const category = categories.find((item) => item.slug === product.category);
            if (category) {
                updatePayload.category = category._id;
                shouldUpdate = true;
            }
        }

        if (typeof product.isActive !== "boolean") {
            updatePayload.isActive = true;
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            await Product.findByIdAndUpdate(product._id, updatePayload);
        }
    }
};

const ensureProductSeedData = async () => {
    const categories = await ensureCategorySeedData();
    await migrateOldProductsToCategoryRefs(categories);

    const productCount = await Product.countDocuments();
    if (productCount > 0) {
        return;
    }

    const categoryMap = categories.reduce((accumulator, item) => {
        accumulator[item.slug] = item;
        return accumulator;
    }, {});

    const normalizedProducts = productSeedData.map((item) => ({
        name: item.name,
        slug: createSlug(item.name),
        description: item.description,
        price: item.price,
        salePrice: item.salePrice,
        images: item.images,
        stock: item.stock,
        sold: item.sold,
        category: categoryMap[item.categorySlug]._id,
        isNew: item.isNew,
        isBestSeller: item.isBestSeller,
        isSale: item.isSale,
        isActive: item.isActive
    }));

    await Product.insertMany(normalizedProducts);
};

const getCategoriesService = async () => {
    return await Category.find({ isActive: true }).sort({ name: 1 });
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

    return await Category.find(filters).sort({ createdAt: -1 });
};

const getCategoryByIdService = async (id) => {
    return await Category.findById(id);
};

const createCategoryService = async (payload) => {
    const slug = createSlug(payload.slug || payload.name);
    const existing = await Category.findOne({ slug });
    if (existing) {
        return {
            success: false,
            message: "Danh mục đã tồn tại"
        };
    }

    const category = await Category.create({
        name: payload.name,
        slug,
        description: payload.description || "",
        isActive: payload.isActive !== false
    });

    return {
        success: true,
        data: category
    };
};

const updateCategoryService = async (id, payload) => {
    const category = await Category.findById(id);
    if (!category) {
        return {
            success: false,
            message: "Danh mục không tồn tại"
        };
    }

    const slug = createSlug(payload.slug || payload.name || category.name);
    const duplicate = await Category.findOne({ slug, _id: { $ne: id } });
    if (duplicate) {
        return {
            success: false,
            message: "Slug danh mục đã tồn tại"
        };
    }

    category.name = payload.name ?? category.name;
    category.slug = slug;
    category.description = payload.description ?? category.description;
    if (typeof payload.isActive === "boolean") {
        category.isActive = payload.isActive;
    }
    await category.save();

    return {
        success: true,
        data: category
    };
};

const deleteCategoryService = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
        return {
            success: false,
            message: "Danh mục không tồn tại"
        };
    }

    category.isActive = false;
    await category.save();

    await Product.updateMany({ category: category._id }, { isActive: false });

    return {
        success: true,
        data: category
    };
};

const getProductsService = async (query) => {
    const { keyword, category, minPrice, maxPrice, stockStatus, isSale, sort } = query;
    const filters = {
        isActive: true
    };

    if (keyword) {
        filters.name = { $regex: keyword, $options: "i" };
    }

    const categoryId = await buildCategoryFilter(category, false);
    if (categoryId === "__EMPTY__") {
        return [];
    }
    if (categoryId) {
        filters.category = categoryId;
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

    let products = await Product.find(filters)
        .populate({
            path: "category",
            match: { isActive: true }
        })
        .sort({ createdAt: -1 });

    products = products.filter((product) => {
        if (!product.category) {
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

    return products.map((item) => {
        const product = buildProductProjection(item);
        return {
            ...product,
            category: {
                _id: product.category._id,
                name: product.category.name,
                slug: product.category.slug
            }
        };
    });
};

const getAdminProductsService = async (query) => {
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

    const categoryId = await buildCategoryFilter(query.category, true);
    if (categoryId === "__EMPTY__") {
        return [];
    }
    if (categoryId) {
        filters.category = categoryId;
    }

    return await Product.find(filters)
        .populate("category")
        .sort({ createdAt: -1 });
};

const getProductDetailService = async (productId) => {
    const product = await Product.findOne({
        _id: productId,
        isActive: true
    }).populate({
        path: "category",
        match: { isActive: true }
    });

    if (!product || !product.category) {
        return null;
    }

    const item = buildProductProjection(product);
    return {
        ...item,
        category: {
            _id: item.category._id,
            name: item.category.name,
            slug: item.category.slug
        }
    };
};

const createProductService = async (payload) => {
    const category = await Category.findById(payload.category);
    if (!category) {
        return {
            success: false,
            message: "Danh mục không tồn tại"
        };
    }

    const slug = createSlug(payload.slug || payload.name);
    const duplicate = await Product.findOne({ slug });
    if (duplicate) {
        return {
            success: false,
            message: "Sản phẩm đã tồn tại"
        };
    }

    const product = await Product.create({
        name: payload.name,
        slug,
        description: payload.description || "",
        price: payload.price,
        salePrice: payload.salePrice || null,
        images: payload.images || [],
        stock: payload.stock || 0,
        sold: payload.sold || 0,
        category: payload.category,
        isNew: payload.isNew === true,
        isBestSeller: payload.isBestSeller === true,
        isSale: payload.isSale === true,
        isActive: payload.isActive !== false
    });

    return {
        success: true,
        data: await Product.findById(product._id).populate("category")
    };
};

const updateProductService = async (id, payload) => {
    const product = await Product.findById(id);
    if (!product) {
        return {
            success: false,
            message: "Sản phẩm không tồn tại"
        };
    }

    if (payload.category) {
        const category = await Category.findById(payload.category);
        if (!category) {
            return {
                success: false,
                message: "Danh mục không tồn tại"
            };
        }
    }

    const slug = createSlug(payload.slug || payload.name || product.name);
    const duplicate = await Product.findOne({ slug, _id: { $ne: id } });
    if (duplicate) {
        return {
            success: false,
            message: "Slug sản phẩm đã tồn tại"
        };
    }

    product.name = payload.name ?? product.name;
    product.slug = slug;
    product.description = payload.description ?? product.description;
    product.price = payload.price ?? product.price;
    product.salePrice = payload.salePrice === "" ? null : (payload.salePrice ?? product.salePrice);
    product.images = payload.images ?? product.images;
    product.stock = payload.stock ?? product.stock;
    product.sold = payload.sold ?? product.sold;
    product.category = payload.category ?? product.category;
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

    return {
        success: true,
        data: await Product.findById(product._id).populate("category")
    };
};

const deleteProductService = async (id) => {
    const product = await Product.findById(id);
    if (!product) {
        return {
            success: false,
            message: "Sản phẩm không tồn tại"
        };
    }

    product.isActive = false;
    await product.save();

    return {
        success: true,
        data: product
    };
};

module.exports = {
    ensureProductSeedData,
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

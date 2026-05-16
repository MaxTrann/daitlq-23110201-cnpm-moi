const Brand = require("../models/brand");
const { createSlug } = require("./slugService");

const getBrandsService = async (query = {}) => {
    const filters = { isActive: true };
    if (query.keyword) {
        filters.name = { $regex: query.keyword, $options: "i" };
    }
    return Brand.find(filters).sort({ name: 1 });
};

const getAdminBrandsService = async (query = {}) => {
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
    return Brand.find(filters).sort({ createdAt: -1 });
};

const createBrandService = async (payload) => {
    const slug = createSlug(payload.slug || payload.name);
    const duplicate = await Brand.findOne({ slug });
    if (duplicate) {
        return { success: false, message: "Thương hiệu đã tồn tại" };
    }
    const brand = await Brand.create({
        name: payload.name,
        slug,
        country: payload.country || "",
        logo: payload.logo || "",
        isActive: payload.isActive !== false
    });
    return { success: true, data: brand };
};

const updateBrandService = async (id, payload) => {
    const brand = await Brand.findById(id);
    if (!brand) {
        return { success: false, message: "Thương hiệu không tồn tại" };
    }
    const slug = createSlug(payload.slug || payload.name || brand.name);
    const duplicate = await Brand.findOne({ slug, _id: { $ne: id } });
    if (duplicate) {
        return { success: false, message: "Slug thương hiệu đã tồn tại" };
    }
    brand.name = payload.name ?? brand.name;
    brand.slug = slug;
    brand.country = payload.country ?? brand.country;
    brand.logo = payload.logo ?? brand.logo;
    if (typeof payload.isActive === "boolean") {
        brand.isActive = payload.isActive;
    }
    await brand.save();
    return { success: true, data: brand };
};

module.exports = {
    getBrandsService,
    getAdminBrandsService,
    createBrandService,
    updateBrandService
};

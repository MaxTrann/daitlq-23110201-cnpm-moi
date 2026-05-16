const {
    getBrandsService,
    getAdminBrandsService,
    createBrandService,
    updateBrandService
} = require("../services/brandService");

const getBrands = async (req, res) => {
    try {
        const data = await getBrandsService(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Không thể lấy thương hiệu" });
    }
};

const getAdminBrands = async (req, res) => {
    try {
        const data = await getAdminBrandsService(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Không thể lấy thương hiệu quản trị" });
    }
};

const createBrand = async (req, res) => {
    try {
        const result = await createBrandService(req.body);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(201).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Không thể tạo thương hiệu" });
    }
};

const updateBrand = async (req, res) => {
    try {
        const result = await updateBrandService(req.params.id, req.body);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Không thể cập nhật thương hiệu" });
    }
};

module.exports = {
    getBrands,
    getAdminBrands,
    createBrand,
    updateBrand
};

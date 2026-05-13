const {
    getCategoriesService,
    getAdminCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
} = require("../services/productService");

const getCategories = async (req, res) => {
    try {
        const data = await getCategoriesService();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể lấy danh mục"
        });
    }
};

const getAdminCategories = async (req, res) => {
    try {
        const data = await getAdminCategoriesService(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể lấy danh mục quản trị"
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const data = await getCategoryByIdService(req.params.id);
        if (!data) {
            return res.status(404).json({
                message: "Danh mục không tồn tại"
            });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể lấy chi tiết danh mục"
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const result = await createCategoryService(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: result.message
            });
        }
        return res.status(201).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể tạo danh mục"
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const result = await updateCategoryService(req.params.id, req.body);
        if (!result.success) {
            return res.status(400).json({
                message: result.message
            });
        }
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể cập nhật danh mục"
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const result = await deleteCategoryService(req.params.id);
        if (!result.success) {
            return res.status(404).json({
                message: result.message
            });
        }
        return res.status(200).json({
            message: "Đã ẩn danh mục",
            data: result.data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể xóa danh mục"
        });
    }
};

module.exports = {
    getCategories,
    getAdminCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

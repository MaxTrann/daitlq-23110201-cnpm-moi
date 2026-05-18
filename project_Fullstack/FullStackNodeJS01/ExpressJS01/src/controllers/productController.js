const {
    getProductsService,
    getHomeProductCarouselService,
    getAdminProductsService,
    getProductDetailService,
    createProductService,
    updateProductService,
    deleteProductService
} = require("../services/productService");

const getHomeProductCarousel = async (req, res) => {
    try {
        const data = await getHomeProductCarouselService(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể lấy sản phẩm nổi bật trang chủ"
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const data = await getProductsService(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể lấy danh sách sản phẩm"
        });
    }
};

const getAdminProducts = async (req, res) => {
    try {
        const data = await getAdminProductsService(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể lấy danh sách sản phẩm quản trị"
        });
    }
};

const getProductDetail = async (req, res) => {
    try {
        const data = await getProductDetailService(req.params.id);
        if (!data) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại"
            });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể lấy chi tiết sản phẩm"
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const result = await createProductService(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: result.message
            });
        }
        return res.status(201).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể tạo sản phẩm"
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const result = await updateProductService(req.params.id, req.body);
        if (!result.success) {
            return res.status(400).json({
                message: result.message
            });
        }
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể cập nhật sản phẩm"
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const result = await deleteProductService(req.params.id);
        if (!result.success) {
            return res.status(404).json({
                message: result.message
            });
        }
        return res.status(200).json({
            message: "Đã ngừng bán sản phẩm",
            data: result.data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Không thể xóa sản phẩm"
        });
    }
};

module.exports = {
    getHomeProductCarousel,
    getProducts,
    getAdminProducts,
    getProductDetail,
    createProduct,
    updateProduct,
    deleteProduct
};

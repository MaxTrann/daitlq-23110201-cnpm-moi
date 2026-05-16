const express = require('express');
const { getUser, getAccount } = require('../controllers/userController');
const {
    register,
    verifyRegisterOtp,
    resendRegisterOtp,
    login,
    forgotPassword,
    verifyResetOtp,
    resetPassword
} = require('../controllers/authController');
const {
    getUserProfile,
    getAdminProfile,
    updateUserProfile,
    updateAdminProfile
} = require('../controllers/profileController');
const {
    getProducts,
    getAdminProducts,
    getProductDetail,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const {
    getCategories,
    getAdminCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const {
    getBrands,
    getAdminBrands,
    createBrand,
    updateBrand
} = require('../controllers/brandController');
const { getDashboardStats } = require('../controllers/adminDashboardController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const authorizeRoles = require('../middleware/authorizeRoles');
const validate = require('../middleware/validate');
const {
    registerValidator,
    verifyOtpValidator,
    resendOtpValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    updateProfileValidator
} = require('../validators/authValidator');
const {
    registerLimiter,
    loginLimiter,
    otpLimiter,
    forgotPasswordLimiter
} = require('../middleware/rateLimit');

const routerAPI = express.Router();

routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

// Auth
routerAPI.post("/auth/register", registerLimiter, registerValidator, validate, register);
routerAPI.post("/auth/verify-email", otpLimiter, verifyOtpValidator, validate, verifyRegisterOtp);
routerAPI.post("/auth/resend-otp", otpLimiter, resendOtpValidator, validate, resendRegisterOtp);
routerAPI.post("/auth/login", loginLimiter, loginValidator, validate, login);
routerAPI.post("/auth/forgot-password", forgotPasswordLimiter, forgotPasswordValidator, validate, forgotPassword);
routerAPI.post("/auth/verify-reset-otp", otpLimiter, verifyOtpValidator, validate, verifyResetOtp);
routerAPI.post("/auth/reset-password", otpLimiter, resetPasswordValidator, validate, resetPassword);

// Profile
routerAPI.get("/user/profile", authorizeRoles("User"), getUserProfile);
routerAPI.put("/user/profile", authorizeRoles("User"), updateProfileValidator, validate, updateUserProfile);
routerAPI.get("/admin/profile", authorizeRoles("Admin"), getAdminProfile);
routerAPI.put("/admin/profile", authorizeRoles("Admin"), updateProfileValidator, validate, updateAdminProfile);

// Legacy / utility
routerAPI.get("/user", authorizeRoles("Admin"), getUser);
routerAPI.get("/account", delay, getAccount);

// Catalog (public via auth middleware whitelist)
routerAPI.get("/products", getProducts);
routerAPI.get("/products/:id", getProductDetail);
routerAPI.get("/categories", getCategories);
routerAPI.get("/categories/:id", getCategoryById);
routerAPI.get("/brands", getBrands);

routerAPI.get("/admin/dashboard/stats", authorizeRoles("Admin"), getDashboardStats);

routerAPI.get("/admin/brands", authorizeRoles("Admin"), getAdminBrands);
routerAPI.post("/admin/brands", authorizeRoles("Admin"), createBrand);
routerAPI.put("/admin/brands/:id", authorizeRoles("Admin"), updateBrand);

// Admin catalog
routerAPI.get("/admin/products", authorizeRoles("Admin"), getAdminProducts);
routerAPI.post("/admin/products", authorizeRoles("Admin"), createProduct);
routerAPI.put("/admin/products/:id", authorizeRoles("Admin"), updateProduct);
routerAPI.delete("/admin/products/:id", authorizeRoles("Admin"), deleteProduct);

routerAPI.get("/admin/categories", authorizeRoles("Admin"), getAdminCategories);
routerAPI.post("/admin/categories", authorizeRoles("Admin"), createCategory);
routerAPI.put("/admin/categories/:id", authorizeRoles("Admin"), updateCategory);
routerAPI.delete("/admin/categories/:id", authorizeRoles("Admin"), deleteCategory);

module.exports = routerAPI;

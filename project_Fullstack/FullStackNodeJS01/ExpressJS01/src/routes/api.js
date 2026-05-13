const express = require('express');
const { createUser, handleLogin, getUser,
    getAccount
} = require('../controllers/userController');
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
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const authorizeRoles = require('../middleware/authorizeRoles');

const routerAPI = express.Router();

routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);
routerAPI.get("/products", getProducts);
routerAPI.get("/products/:id", getProductDetail);
routerAPI.get("/categories", getCategories);
routerAPI.get("/categories/:id", getCategoryById);

routerAPI.get("/admin/products", authorizeRoles("Admin"), getAdminProducts);
routerAPI.post("/admin/products", authorizeRoles("Admin"), createProduct);
routerAPI.put("/admin/products/:id", authorizeRoles("Admin"), updateProduct);
routerAPI.delete("/admin/products/:id", authorizeRoles("Admin"), deleteProduct);

routerAPI.get("/admin/categories", authorizeRoles("Admin"), getAdminCategories);
routerAPI.post("/admin/categories", authorizeRoles("Admin"), createCategory);
routerAPI.put("/admin/categories/:id", authorizeRoles("Admin"), updateCategory);
routerAPI.delete("/admin/categories/:id", authorizeRoles("Admin"), deleteCategory);

module.exports = routerAPI; //export default

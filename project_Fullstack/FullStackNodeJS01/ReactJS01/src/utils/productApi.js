import axios from "./axios.customize";

const getProductsApi = (params = {}) => axios.get("/v1/api/products", { params });
const getProductDetailApi = (id) => axios.get(`/v1/api/products/${id}`);
const getCategoriesApi = () => axios.get("/v1/api/categories");
const getBrandsApi = () => axios.get("/v1/api/brands");

const getAdminProductsApi = (params = {}) => axios.get("/v1/api/admin/products", { params });
const createProductApi = (data) => axios.post("/v1/api/admin/products", data);
const updateProductApi = (id, data) => axios.put(`/v1/api/admin/products/${id}`, data);
const deleteProductApi = (id) => axios.delete(`/v1/api/admin/products/${id}`);

const getAdminCategoriesApi = (params = {}) => axios.get("/v1/api/admin/categories", { params });
const getCategoryDetailApi = (id) => axios.get(`/v1/api/categories/${id}`);
const createCategoryApi = (data) => axios.post("/v1/api/admin/categories", data);
const updateCategoryApi = (id, data) => axios.put(`/v1/api/admin/categories/${id}`, data);
const deleteCategoryApi = (id) => axios.delete(`/v1/api/admin/categories/${id}`);

export {
    getProductsApi,
    getProductDetailApi,
    getCategoriesApi,
    getBrandsApi,
    getAdminProductsApi,
    createProductApi,
    updateProductApi,
    deleteProductApi,
    getAdminCategoriesApi,
    getCategoryDetailApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi
};

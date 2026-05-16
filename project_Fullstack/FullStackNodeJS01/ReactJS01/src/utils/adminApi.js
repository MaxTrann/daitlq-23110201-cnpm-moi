import axios from "./axios.customize";

const getDashboardStatsApi = () => axios.get("/v1/api/admin/dashboard/stats");

const getAdminBrandsApi = (params = {}) => axios.get("/v1/api/admin/brands", { params });
const createBrandApi = (data) => axios.post("/v1/api/admin/brands", data);
const updateBrandApi = (id, data) => axios.put(`/v1/api/admin/brands/${id}`, data);

export {
    getDashboardStatsApi,
    getAdminBrandsApi,
    createBrandApi,
    updateBrandApi,
};

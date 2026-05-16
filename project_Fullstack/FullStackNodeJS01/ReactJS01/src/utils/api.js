import axios from "./axios.customize";

const handleAuthError = (res) => {
    if (res?.errors?.length) {
        return res.errors.map((item) => item.message).join(", ");
    }
    return res?.EM ?? "Có lỗi xảy ra";
};

const registerApi = (name, email, password) => {
    return axios.post("/v1/api/auth/register", { name, email, password });
};

const verifyRegisterOtpApi = (email, otp) => {
    return axios.post("/v1/api/auth/verify-email", { email, otp });
};

const resendRegisterOtpApi = (email) => {
    return axios.post("/v1/api/auth/resend-otp", { email });
};

const loginApi = (email, password) => {
    return axios.post("/v1/api/auth/login", { email, password });
};

const forgotPasswordApi = (email) => {
    return axios.post("/v1/api/auth/forgot-password", { email });
};

const verifyResetOtpApi = (email, otp) => {
    return axios.post("/v1/api/auth/verify-reset-otp", { email, otp });
};

const resetPasswordApi = (resetToken, newPassword) => {
    return axios.post("/v1/api/auth/reset-password", { resetToken, newPassword });
};

const getUserApi = () => {
    return axios.get("/v1/api/user");
};

const getAccountApi = () => {
    return axios.get("/v1/api/account");
};

const getUserProfileApi = () => {
    return axios.get("/v1/api/user/profile");
};

const getAdminProfileApi = () => {
    return axios.get("/v1/api/admin/profile");
};

const updateUserProfileApi = (payload) => {
    return axios.put("/v1/api/user/profile", payload);
};

const updateAdminProfileApi = (payload) => {
    return axios.put("/v1/api/admin/profile", payload);
};

export {
    registerApi,
    verifyRegisterOtpApi,
    resendRegisterOtpApi,
    loginApi,
    forgotPasswordApi,
    verifyResetOtpApi,
    resetPasswordApi,
    getUserApi,
    getAccountApi,
    getUserProfileApi,
    getAdminProfileApi,
    updateUserProfileApi,
    updateAdminProfileApi,
    handleAuthError
};

const {
    registerService,
    verifyRegisterOtpService,
    resendRegisterOtpService,
    loginService,
    forgotPasswordService,
    verifyResetOtpService,
    resetPasswordService
} = require("../services/authService");

const register = async (req, res) => {
    try {
        const data = await registerService(req.body);
        const status = data.EC === 0 ? 201 : 400;
        return res.status(status).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể đăng ký tài khoản" });
    }
};

const verifyRegisterOtp = async (req, res) => {
    try {
        const data = await verifyRegisterOtpService(req.body);
        const status = data.EC === 0 ? 200 : 400;
        return res.status(status).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể xác thực OTP" });
    }
};

const resendRegisterOtp = async (req, res) => {
    try {
        const data = await resendRegisterOtpService(req.body.email);
        const status = data.EC === 0 ? 200 : 400;
        return res.status(status).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể gửi lại OTP" });
    }
};

const login = async (req, res) => {
    try {
        const data = await loginService(req.body);
        if (data.EC === 0) {
            return res.status(200).json(data);
        }
        if (data.EC === 4) {
            return res.status(403).json(data);
        }
        return res.status(401).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể đăng nhập" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const data = await forgotPasswordService(req.body.email);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể gửi OTP đặt lại mật khẩu" });
    }
};

const verifyResetOtp = async (req, res) => {
    try {
        const data = await verifyResetOtpService(req.body);
        const status = data.EC === 0 ? 200 : 400;
        return res.status(status).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể xác thực OTP" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const data = await resetPasswordService(req.body);
        const status = data.EC === 0 ? 200 : 400;
        return res.status(status).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể đặt lại mật khẩu" });
    }
};

module.exports = {
    register,
    verifyRegisterOtp,
    resendRegisterOtp,
    login,
    forgotPassword,
    verifyResetOtp,
    resetPassword
};

const rateLimit = require("express-rate-limit");

const createLimiter = ({ windowMs, max, message }) => rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        EC: 429,
        EM: message
    }
});

const registerLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_REGISTER_MAX || 5),
    message: "Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau."
});

const loginLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_LOGIN_MAX || 10),
    message: "Quá nhiều lần đăng nhập. Vui lòng thử lại sau 15 phút."
});

const otpLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_OTP_MAX || 8),
    message: "Quá nhiều yêu cầu OTP. Vui lòng thử lại sau."
});

const forgotPasswordLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_FORGOT_MAX || 5),
    message: "Quá nhiều yêu cầu quên mật khẩu. Vui lòng thử lại sau."
});

module.exports = {
    registerLimiter,
    loginLimiter,
    otpLimiter,
    forgotPasswordLimiter
};

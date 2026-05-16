const { body } = require("express-validator");

const passwordRules = body("password")
    .trim()
    .isLength({ min: 8 }).withMessage("Mật khẩu tối thiểu 8 ký tự")
    .matches(/[a-z]/).withMessage("Mật khẩu phải có chữ thường")
    .matches(/[A-Z]/).withMessage("Mật khẩu phải có chữ hoa")
    .matches(/\d/).withMessage("Mật khẩu phải có số");

const registerValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Tên hiển thị không được để trống")
        .isLength({ min: 2, max: 50 }).withMessage("Tên hiển thị từ 2-50 ký tự"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ")
        .normalizeEmail(),
    passwordRules
];

const verifyOtpValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ")
        .normalizeEmail(),
    body("otp")
        .trim()
        .notEmpty().withMessage("OTP không được để trống")
        .isLength({ min: 6, max: 6 }).withMessage("OTP phải có 6 chữ số")
        .isNumeric().withMessage("OTP chỉ gồm số")
];

const resendOtpValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ")
        .normalizeEmail()
];

const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Mật khẩu không được để trống")
];

const forgotPasswordValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không hợp lệ")
        .normalizeEmail()
];

const resetPasswordValidator = [
    body("resetToken")
        .notEmpty().withMessage("Reset token không hợp lệ"),
    body("newPassword")
        .trim()
        .isLength({ min: 8 }).withMessage("Mật khẩu tối thiểu 8 ký tự")
        .matches(/[a-z]/).withMessage("Mật khẩu phải có chữ thường")
        .matches(/[A-Z]/).withMessage("Mật khẩu phải có chữ hoa")
        .matches(/\d/).withMessage("Mật khẩu phải có số")
];

const updateProfileValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage("Tên hiển thị từ 2-50 ký tự"),
    body("phone")
        .optional()
        .trim()
        .isLength({ max: 20 }).withMessage("Số điện thoại tối đa 20 ký tự"),
    body("address")
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage("Địa chỉ tối đa 255 ký tự"),
    body("avatar")
        .optional({ values: "falsy" })
        .trim()
        .custom((value) => {
            if (!value) {
                return true;
            }
            try {
                new URL(value);
                return true;
            } catch {
                throw new Error("Avatar phải là URL hợp lệ");
            }
        }),
    body("currentPassword")
        .optional()
        .notEmpty().withMessage("Mật khẩu hiện tại không được để trống khi đổi mật khẩu"),
    body("newPassword")
        .optional()
        .trim()
        .isLength({ min: 8 }).withMessage("Mật khẩu mới tối thiểu 8 ký tự")
        .matches(/[a-z]/).withMessage("Mật khẩu mới phải có chữ thường")
        .matches(/[A-Z]/).withMessage("Mật khẩu mới phải có chữ hoa")
        .matches(/\d/).withMessage("Mật khẩu mới phải có số")
];

module.exports = {
    registerValidator,
    verifyOtpValidator,
    resendOtpValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    updateProfileValidator
};

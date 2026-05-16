require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendRegisterOtp, sendPasswordResetOtp, verifyOtp } = require("./otpService");

const SALT_ROUNDS = 10;
const jwtExpireValue = /^\d+$/.test(process.env.JWT_EXPIRE || "")
    ? Number(process.env.JWT_EXPIRE)
    : (process.env.JWT_EXPIRE || "7d");

const getProfileUrlByRole = (role) => {
    return role === "Admin" ? "/admin/dashboard" : "/user/profile";
};

const buildAuthResponse = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    };

    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: jwtExpireValue
    });

    return {
        EC: 0,
        EM: "Thành công",
        access_token,
        redirectUrl: getProfileUrlByRole(user.role),
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone || "",
            address: user.address || "",
            avatar: user.avatar || "",
            isEmailVerified: user.isEmailVerified
        }
    };
};

const registerService = async ({ name, email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser?.isEmailVerified) {
        return { EC: 1, EM: "Email đã được sử dụng" };
    }

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    if (existingUser && !existingUser.isEmailVerified) {
        existingUser.name = name;
        existingUser.password = hashPassword;
        await existingUser.save();
    } else if (!existingUser) {
        await User.create({
            name,
            email: normalizedEmail,
            password: hashPassword,
            role: "User",
            isEmailVerified: false
        });
    }

    await sendRegisterOtp(normalizedEmail);

    return {
        EC: 0,
        EM: "Đăng ký thành công. Vui lòng kiểm tra email để nhập mã OTP kích hoạt.",
        email: normalizedEmail
    };
};

const verifyRegisterOtpService = async ({ email, otp }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const otpResult = await verifyOtp(normalizedEmail, otp, "register");

    if (!otpResult.success) {
        return { EC: 2, EM: otpResult.message };
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        return { EC: 3, EM: "Tài khoản không tồn tại" };
    }

    user.isEmailVerified = true;
    await user.save();

    return {
        EC: 0,
        EM: "Kích hoạt tài khoản thành công. Bạn có thể đăng nhập.",
        email: normalizedEmail
    };
};

const resendRegisterOtpService = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        return { EC: 0, EM: "Nếu email tồn tại, mã OTP sẽ được gửi lại." };
    }

    if (user.isEmailVerified) {
        return { EC: 1, EM: "Tài khoản đã được kích hoạt" };
    }

    await sendRegisterOtp(normalizedEmail);
    return { EC: 0, EM: "Đã gửi lại mã OTP. Vui lòng kiểm tra email." };
};

const loginService = async ({ email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        return { EC: 1, EM: "Email hoặc mật khẩu không đúng" };
    }

    if (!user.isEmailVerified) {
        return {
            EC: 4,
            EM: "Tài khoản chưa được kích hoạt. Vui lòng xác thực OTP qua email.",
            email: normalizedEmail,
            requiresVerification: true
        };
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
        return { EC: 1, EM: "Email hoặc mật khẩu không đúng" };
    }

    return buildAuthResponse(user);
};

const forgotPasswordService = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, isEmailVerified: true });

    if (user) {
        await sendPasswordResetOtp(normalizedEmail);
    }

    return {
        EC: 0,
        EM: "Nếu email tồn tại trong hệ thống, mã OTP đã được gửi."
    };
};

const verifyResetOtpService = async ({ email, otp }) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, isEmailVerified: true });

    if (!user) {
        return { EC: 1, EM: "Email không hợp lệ" };
    }

    const otpResult = await verifyOtp(normalizedEmail, otp, "password_reset");
    if (!otpResult.success) {
        return { EC: 2, EM: otpResult.message };
    }

    const resetToken = jwt.sign(
        { id: user._id, email: user.email, purpose: "password_reset" },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    return {
        EC: 0,
        EM: "Xác thực OTP thành công",
        resetToken
    };
};

const resetPasswordService = async ({ resetToken, newPassword }) => {
    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (decoded.purpose !== "password_reset") {
            return { EC: 1, EM: "Token không hợp lệ" };
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return { EC: 2, EM: "Người dùng không tồn tại" };
        }

        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await user.save();

        return { EC: 0, EM: "Đặt lại mật khẩu thành công" };
    } catch (error) {
        return { EC: 3, EM: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn" };
    }
};

module.exports = {
    registerService,
    verifyRegisterOtpService,
    resendRegisterOtpService,
    loginService,
    forgotPasswordService,
    verifyResetOtpService,
    resetPasswordService,
    getProfileUrlByRole
};

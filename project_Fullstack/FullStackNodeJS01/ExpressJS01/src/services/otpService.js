require("dotenv").config();
const bcrypt = require("bcrypt");
const Otp = require("../models/otp");
const { sendOtpEmail } = require("./emailService");

const OTP_LENGTH = 6;
const OTP_SALT_ROUNDS = 10;
const MAX_VERIFY_ATTEMPTS = 5;

const getOtpExpireMinutes = () => Number(process.env.OTP_EXPIRE_MINUTES || 10);

const generateOtpCode = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};

const saveOtp = async (email, type) => {
    const otp = generateOtpCode();
    const otpHash = await bcrypt.hash(otp, OTP_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + getOtpExpireMinutes() * 60 * 1000);

    await Otp.deleteMany({ email, type });

    await Otp.create({
        email: email.toLowerCase(),
        otpHash,
        type,
        expiresAt,
        attempts: 0
    });

    return otp;
};

const sendRegisterOtp = async (email) => {
    const otp = await saveOtp(email, "register");
    await sendOtpEmail({
        to: email,
        subject: "Xác thực đăng ký Campus Shop",
        otp,
        purpose: "đăng ký tài khoản"
    });
    return { success: true };
};

const sendPasswordResetOtp = async (email) => {
    const otp = await saveOtp(email, "password_reset");
    await sendOtpEmail({
        to: email,
        subject: "Đặt lại mật khẩu Campus Shop",
        otp,
        purpose: "đặt lại mật khẩu"
    });
    return { success: true };
};

const verifyOtp = async (email, otp, type) => {
    const record = await Otp.findOne({
        email: email.toLowerCase(),
        type
    }).sort({ createdAt: -1 });

    if (!record) {
        return { success: false, message: "Mã OTP không tồn tại hoặc đã hết hạn" };
    }

    if (record.expiresAt < new Date()) {
        await Otp.deleteOne({ _id: record._id });
        return { success: false, message: "Mã OTP đã hết hạn" };
    }

    if (record.attempts >= MAX_VERIFY_ATTEMPTS) {
        await Otp.deleteOne({ _id: record._id });
        return { success: false, message: "Đã vượt quá số lần nhập OTP. Vui lòng yêu cầu mã mới." };
    }

    const isMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isMatch) {
        record.attempts += 1;
        await record.save();
        return { success: false, message: "Mã OTP không đúng" };
    }

    await Otp.deleteOne({ _id: record._id });
    return { success: true };
};

module.exports = {
    sendRegisterOtp,
    sendPasswordResetOtp,
    verifyOtp
};

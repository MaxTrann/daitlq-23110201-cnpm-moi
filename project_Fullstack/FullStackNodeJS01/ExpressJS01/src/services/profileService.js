require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/user");

const SALT_ROUNDS = 10;

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    address: user.address || "",
    avatar: user.avatar || "",
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

const getProfileService = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        return { success: false, message: "Người dùng không tồn tại" };
    }
    return { success: true, data: sanitizeUser(user) };
};

const updateProfileService = async (userId, payload) => {
    const user = await User.findById(userId);
    if (!user) {
        return { success: false, message: "Người dùng không tồn tại" };
    }

    if (payload.name !== undefined) {
        user.name = payload.name;
    }
    if (payload.phone !== undefined) {
        user.phone = payload.phone;
    }
    if (payload.address !== undefined) {
        user.address = payload.address;
    }
    if (payload.avatar !== undefined) {
        user.avatar = payload.avatar;
    }

    if (payload.newPassword) {
        if (!payload.currentPassword) {
            return { success: false, message: "Vui lòng nhập mật khẩu hiện tại" };
        }
        const isMatch = await bcrypt.compare(payload.currentPassword, user.password);
        if (!isMatch) {
            return { success: false, message: "Mật khẩu hiện tại không đúng" };
        }
        user.password = await bcrypt.hash(payload.newPassword, SALT_ROUNDS);
    }

    await user.save();
    return { success: true, data: sanitizeUser(user) };
};

module.exports = {
    getProfileService,
    updateProfileService
};

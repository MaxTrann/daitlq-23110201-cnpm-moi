const { getProfileService, updateProfileService } = require("../services/profileService");

const getUserProfile = async (req, res) => {
    try {
        const result = await getProfileService(req.user.id);
        if (!result.success) {
            return res.status(404).json({ EC: 404, EM: result.message });
        }
        return res.status(200).json({ EC: 0, EM: "Thành công", data: result.data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể lấy hồ sơ" });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        const result = await getProfileService(req.user.id);
        if (!result.success) {
            return res.status(404).json({ EC: 404, EM: result.message });
        }
        return res.status(200).json({ EC: 0, EM: "Thành công", data: result.data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể lấy hồ sơ admin" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const result = await updateProfileService(req.user.id, req.body);
        if (!result.success) {
            return res.status(400).json({ EC: 400, EM: result.message });
        }
        return res.status(200).json({ EC: 0, EM: "Cập nhật hồ sơ thành công", data: result.data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể cập nhật hồ sơ" });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const result = await updateProfileService(req.user.id, req.body);
        if (!result.success) {
            return res.status(400).json({ EC: 400, EM: result.message });
        }
        return res.status(200).json({ EC: 0, EM: "Cập nhật hồ sơ admin thành công", data: result.data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: 500, EM: "Không thể cập nhật hồ sơ admin" });
    }
};

module.exports = {
    getUserProfile,
    getAdminProfile,
    updateUserProfile,
    updateAdminProfile
};

const { getUserService } = require("../services/userService");
const { getProfileService } = require("../services/profileService");

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data);
};

const getAccount = async (req, res) => {
    const result = await getProfileService(req.user.id);
    if (!result.success) {
        return res.status(404).json({ EC: 404, EM: result.message });
    }
    return res.status(200).json({
        EC: 0,
        EM: "Thành công",
        data: result.data
    });
};

module.exports = {
    getUser,
    getAccount
};

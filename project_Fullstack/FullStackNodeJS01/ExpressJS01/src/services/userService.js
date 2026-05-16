const User = require("../models/user");

const getUserService = async () => {
    try {
        return await User.find({}).select("-password");
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    getUserService
};

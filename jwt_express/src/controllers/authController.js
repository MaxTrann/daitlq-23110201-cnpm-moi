const authService = require("../services/authService");

// LOGIN
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { accessToken, refreshToken } = await authService.loginUser(username, password);

        //set cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // true nếu HTTPS
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 phút
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // true nếu HTTPS
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        res.json({message: "Login successful"});
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};

// REFRESH TOKEN (rotation)
exports.refresh = (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        const { accessToken, refreshToken } = authService.refreshSession(token);

        // set new cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({message: "Token refreshed"});
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal server error" });
    }
};


// LOGOUT
exports.logout = (req, res) => {
    const token = req.cookies.refreshToken;
    authService.logoutSession(token);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    
    res.json({message: "Logged out"});
};

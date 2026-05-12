const express = require("express");
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

const router = express.Router();

const decodeToken = (token) => {
    if (!token) {
        return null;
    }

    return jwt.decode(token);
};

const renderDemo = (req, res, extras = {}) => {
    const accessToken = req.cookies.accessToken || null;
    const refreshToken = req.cookies.refreshToken || null;

    res.render("demo", {
        title: "JWT Browser Demo",
        username: "admin",
        password: "123456",
        accessToken,
        refreshToken,
        accessPayload: decodeToken(accessToken),
        refreshPayload: decodeToken(refreshToken),
        result: extras.result || null,
        error: extras.error || null
    });
};

router.get("/", (req, res) => {
    res.redirect("/demo");
});

router.get("/demo", (req, res) => {
    renderDemo(req, res);
});

router.post("/demo/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const { accessToken, refreshToken } = await authService.loginUser(username, password);

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

        renderDemo(req, res, {
            result: "Login successful. Browser da nhan accessToken va refreshToken qua cookie."
        });
    } catch (error) {
        renderDemo(req, res, { error: error.message });
    }
});

router.post("/demo/protected", (req, res) => {
    try {
        const user = authService.verifyAccessToken(req.cookies.accessToken);
        renderDemo(req, res, {
            result: `Protected route passed. User from token: ${JSON.stringify(user)}`
        });
    } catch (error) {
        renderDemo(req, res, { error: error.message });
    }
});

router.post("/demo/refresh", (req, res) => {
    try {
        const { accessToken, refreshToken } = authService.refreshSession(req.cookies.refreshToken);

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

        renderDemo(req, res, {
            result: "Refresh successful. Access token va refresh token da duoc cap moi."
        });
    } catch (error) {
        renderDemo(req, res, { error: error.message });
    }
});

router.post("/demo/logout", (req, res) => {
    authService.logoutSession(req.cookies.refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    renderDemo(req, res, {
        result: "Logout successful. Cookie accessToken va refreshToken da bi xoa."
    });
});

module.exports = router;

require("dotenv").config();
const jwt = require("jsonwebtoken");

const publicRouteMatchers = [
    { method: "GET", exact: "/" },
    { method: "POST", exact: "/auth/register" },
    { method: "POST", exact: "/auth/verify-email" },
    { method: "POST", exact: "/auth/resend-otp" },
    { method: "POST", exact: "/auth/login" },
    { method: "POST", exact: "/auth/forgot-password" },
    { method: "POST", exact: "/auth/verify-reset-otp" },
    { method: "POST", exact: "/auth/reset-password" },
    { method: "GET", exact: "/products" },
    { method: "GET", exact: "/categories" },
    { method: "GET", exact: "/brands" },
    { method: "GET", pattern: /^\/products\/[^/]+$/ },
    { method: "GET", pattern: /^\/categories\/[^/]+$/ }
];

const auth = (req, res, next) => {
    const isPublicRoute = publicRouteMatchers.some((matcher) => {
        if (matcher.method !== req.method) {
            return false;
        }

        if (matcher.exact) {
            return matcher.exact === req.path;
        }

        return matcher.pattern.test(req.path);
    });

    if (isPublicRoute) {
        return next();
    }

    const token = req?.headers?.authorization?.split(" ")?.[1];
    if (!token) {
        return res.status(401).json({
            EC: 401,
            EM: "Bạn chưa truyền Access Token ở header hoặc token đã hết hạn"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(401).json({
            EC: 401,
            EM: "Token bị hết hạn hoặc không hợp lệ"
        });
    }
};

module.exports = auth;

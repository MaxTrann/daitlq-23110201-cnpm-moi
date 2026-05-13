require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const publicRouteMatchers = [
        { method: "GET", exact: "/" },
        { method: "POST", exact: "/register" },
        { method: "POST", exact: "/login" },
        { method: "GET", exact: "/products" },
        { method: "GET", exact: "/categories" },
        { method: "GET", pattern: /^\/products\/[^/]+$/ },
        { method: "GET", pattern: /^\/categories\/[^/]+$/ }
    ];

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
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];

            //verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role,
                    createdBy: "tranlequocdai"
                }
                console.log(">>> check token: ", decoded)
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token bị hết hạn/hoặc không hợp lệ"
                })
            }
        } else {
            return res.status(401).json({
                message: "Bạn chưa truyền Access Token ở header hoặc token đã hết hạn"
            })
        }
    }
}

module.exports = auth;

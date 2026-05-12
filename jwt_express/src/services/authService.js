const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users, refreshTokens } = require("../db");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const createError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const loginUser = async (username, password) => {
    const user = users.find((item) => item.username === username);
    if (!user) {
        throw createError(401, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createError(401, "Wrong password");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    return { accessToken, refreshToken, user };
};

const refreshSession = (token) => {
    if (!token) {
        throw createError(401, "Refresh token is required");
    }

    if (!refreshTokens.includes(token)) {
        throw createError(403, "Refresh token is invalid");
    }

    let user;
    try {
        user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw createError(403, "Refresh token expired or invalid");
    }

    const index = refreshTokens.indexOf(token);
    if (index > -1) {
        refreshTokens.splice(index, 1);
    }

    const accessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    refreshTokens.push(refreshToken);

    return { accessToken, refreshToken, user };
};

const logoutSession = (token) => {
    if (!token) {
        return;
    }

    const index = refreshTokens.indexOf(token);
    if (index > -1) {
        refreshTokens.splice(index, 1);
    }
};

const verifyAccessToken = (token) => {
    if (!token) {
        throw createError(401, "Access token is required");
    }

    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw createError(403, "Access token expired or invalid");
    }
};

module.exports = {
    loginUser,
    refreshSession,
    logoutSession,
    verifyAccessToken
};

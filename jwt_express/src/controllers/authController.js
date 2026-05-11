const bcrypy = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { v4: uuidv4} = require("uuid")
const { users, refreshTokens} = require("../db")
const { generateAccessToken, generateRefreshToken} = require("../utils/jwt");

// LOGIN
exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return status(401).json({message: "User not found"});
}
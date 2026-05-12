const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter for login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { message: "Too many login attempts, please try again later." }
});

router.post("/login", loginLimiter, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// protected route
router.get("/protected", verifyToken, (req, res) => {
    res.json({user: req.user});
});

module.exports = router;

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otpHash: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["register", "password_reset"],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model('otps', otpSchema);

module.exports = Otp;

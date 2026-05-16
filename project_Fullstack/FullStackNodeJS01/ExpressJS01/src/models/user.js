const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const User = mongoose.model('users', userSchema);

module.exports = User;

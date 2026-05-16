const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    country: {
        type: String,
        default: ""
    },
    logo: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Brand = mongoose.model('brands', brandSchema);

module.exports = Brand;

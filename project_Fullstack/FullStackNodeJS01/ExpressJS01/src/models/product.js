const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    salePrice: {
        type: Number,
        default: null,
        min: 0
    },
    images: {
        type: [String],
        default: []
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    sold: {
        type: Number,
        default: 0,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    isNew: {
        type: Boolean,
        default: false
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    isSale: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    suppressReservedKeysWarning: true
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;

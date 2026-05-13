const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;

const mongoose = require('mongoose');
const { CATEGORY_KINDS } = require('../constants/medcare');

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
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        default: null
    },
    categoryKind: {
        type: String,
        enum: CATEGORY_KINDS,
        default: 'medicine'
    },
    icon: {
        type: String,
        default: ""
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

categorySchema.index({ parentId: 1, isActive: 1 });

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;

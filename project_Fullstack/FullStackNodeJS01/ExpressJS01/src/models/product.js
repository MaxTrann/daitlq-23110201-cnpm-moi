const mongoose = require('mongoose');
const { PRODUCT_TYPES, DRUG_CLASSES } = require('../constants/medcare');

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
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    barcode: {
        type: String,
        default: ""
    },
    shortDescription: {
        type: String,
        default: ""
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
    viewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands',
        default: null
    },
    productType: {
        type: String,
        enum: PRODUCT_TYPES,
        required: true
    },
    drugClass: {
        type: String,
        enum: DRUG_CLASSES,
        required: true
    },
    allowedOnlineSale: {
        type: Boolean,
        default: true
    },
    requiresPharmacistAdvice: {
        type: Boolean,
        default: false
    },
    unitLabel: {
        type: String,
        default: "Hộp"
    },
    packagingDescription: {
        type: String,
        default: ""
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

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ productType: 1, drugClass: 1 });
productSchema.index({ sold: -1, isActive: 1 });
productSchema.index({ viewCount: -1, isActive: 1 });
productSchema.index({ name: 'text', sku: 'text', shortDescription: 'text' });

productSchema.virtual('medicineDetail', {
    ref: 'medicine_details',
    localField: '_id',
    foreignField: 'productId',
    justOne: true
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('products', productSchema);

module.exports = Product;

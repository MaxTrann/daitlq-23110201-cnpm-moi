const mongoose = require('mongoose');

const productBatchSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    batchCode: {
        type: String,
        required: true,
        trim: true
    },
    manufacturingDate: {
        type: Date,
        default: null
    },
    expiryDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    importPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

productBatchSchema.index({ productId: 1, expiryDate: 1 });

const ProductBatch = mongoose.model('product_batches', productBatchSchema);

module.exports = ProductBatch;

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    recipientName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    province: {
        type: String,
        default: ""
    },
    district: {
        type: String,
        default: ""
    },
    ward: {
        type: String,
        default: ""
    },
    streetAddress: {
        type: String,
        required: true,
        trim: true
    },
    label: {
        type: String,
        default: "Nhà"
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

addressSchema.index({ userId: 1 });

const Address = mongoose.model('addresses', addressSchema);

module.exports = Address;

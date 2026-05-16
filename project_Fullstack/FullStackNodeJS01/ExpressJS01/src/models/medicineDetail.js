const mongoose = require('mongoose');
const { DOSAGE_FORMS } = require('../constants/medcare');

const medicineDetailSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
        unique: true
    },
    activeIngredient: {
        type: String,
        default: ""
    },
    registrationNo: {
        type: String,
        default: ""
    },
    dosageForm: {
        type: String,
        enum: DOSAGE_FORMS,
        default: 'other'
    },
    concentration: {
        type: String,
        default: ""
    },
    indications: {
        type: String,
        default: ""
    },
    usage: {
        type: String,
        default: ""
    },
    contraindications: {
        type: String,
        default: ""
    },
    sideEffects: {
        type: String,
        default: ""
    },
    warnings: {
        type: String,
        default: ""
    },
    storage: {
        type: String,
        default: ""
    },
    prescriptionRequired: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

medicineDetailSchema.index({ activeIngredient: 'text' });

const MedicineDetail = mongoose.model('medicine_details', medicineDetailSchema);

module.exports = MedicineDetail;

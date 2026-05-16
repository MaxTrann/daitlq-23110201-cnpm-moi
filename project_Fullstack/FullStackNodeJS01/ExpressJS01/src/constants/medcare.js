const PRODUCT_TYPES = [
    "medicine_otc",
    "medicine_rx",
    "functional_food",
    "medical_device",
    "cosmetic",
    "personal_care"
];

const DRUG_CLASSES = ["otc", "rx", "not_applicable"];

const CATEGORY_KINDS = [
    "medicine",
    "supplement",
    "device",
    "cosmetic",
    "personal_care"
];

const DOSAGE_FORMS = [
    "tablet",
    "capsule",
    "syrup",
    "cream",
    "injection",
    "powder",
    "other"
];

const applyDrugDefaults = (productType) => {
    switch (productType) {
        case "medicine_otc":
            return { drugClass: "otc", allowedOnlineSale: true };
        case "medicine_rx":
            return { drugClass: "rx", allowedOnlineSale: false };
        default:
            return { drugClass: "not_applicable", allowedOnlineSale: true };
    }
};

module.exports = {
    PRODUCT_TYPES,
    DRUG_CLASSES,
    CATEGORY_KINDS,
    DOSAGE_FORMS,
    applyDrugDefaults
};

/** Đơn vị bán phổ biến — nhà thuốc / bán lẻ dược phẩm */
export const PRODUCT_UNIT_LABELS = [
    "Hộp",
    "Vỉ",
    "Gói",
    "Chai",
    "Lọ",
    "Tuýp",
    "Túi",
    "Bộ",
    "Cái",
    "Viên",
    "Ống",
    "Hũ",
    "Miếng",
    "Cuộn",
    "Thùng",
];

export const PRODUCT_UNIT_OPTIONS = PRODUCT_UNIT_LABELS.map((label) => ({
    value: label,
    label,
}));

/** Quy cách đóng gói gợi ý theo đơn vị bán */
export const PACKAGING_BY_UNIT = {
    Hộp: [
        "Hộp 10 viên",
        "Hộp 20 viên",
        "Hộp 30 viên",
        "Hộp 60 viên",
        "Hộp 3 vỉ x 10 viên",
        "Hộp 6 gói",
        "Hộp 10 vỉ",
    ],
    Vỉ: ["Vỉ 6 viên", "Vỉ 10 viên", "Vỉ 20 viên", "Vỉ 30 viên"],
    Gói: ["Gói 1 gói", "Gói 5 gói", "Hộp 6 gói"],
    Chai: ["Chai 60ml", "Chai 100ml", "Chai 120ml", "Chai 500ml"],
    Lọ: ["Lọ 30ml", "Lọ 60ml", "Lọ 100ml"],
    Tuýp: ["Tuýp 10g", "Tuýp 15g", "Tuýp 30g", "Tuýp 50g"],
    Túi: ["Túi 50g", "Túi 100g", "Túi 200g"],
    Bộ: ["1 bộ", "1 máy + cuff", "Bộ đầy đủ phụ kiện"],
    Cái: ["1 cái"],
    Viên: ["1 viên", "Lọ 100 viên"],
    Ống: ["Hộp 5 ống", "Hộp 10 ống"],
    Hũ: ["Hũ 50g", "Hũ 100g", "Hũ 200g"],
    Miếng: ["Hộp 4 miếng", "Hộp 8 miếng"],
    Cuộn: ["Cuộn 5m", "Cuộn 10m"],
    Thùng: ["Thùng 12 hộp", "Thùng 24 chai"],
};

export const PACKAGING_COMMON = [
    ...new Set(Object.values(PACKAGING_BY_UNIT).flat()),
];

const toSelectOptions = (labels) =>
    labels.map((label) => ({ value: label, label }));

export const buildProductUnitOptions = (currentValue) => {
    if (currentValue && !PRODUCT_UNIT_LABELS.includes(currentValue)) {
        return toSelectOptions([currentValue, ...PRODUCT_UNIT_LABELS]);
    }
    return PRODUCT_UNIT_OPTIONS;
};

export const buildPackagingOptions = (unitLabel, currentValue) => {
    const presets = unitLabel && PACKAGING_BY_UNIT[unitLabel]
        ? PACKAGING_BY_UNIT[unitLabel]
        : PACKAGING_COMMON;

    if (currentValue && !presets.includes(currentValue)) {
        return toSelectOptions([currentValue, ...presets]);
    }
    return toSelectOptions(presets);
};

export const isAllowedUnitLabel = (value) =>
    Boolean(value && PRODUCT_UNIT_LABELS.includes(value.trim()));

const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value);
};

const formatDiscountPercent = (price, salePrice) => {
    if (!salePrice || salePrice >= price) {
        return 0;
    }
    return Math.round(((price - salePrice) / price) * 100);
};

const formatNumber = (value = 0) => new Intl.NumberFormat("vi-VN").format(value);

export {
    formatCurrency,
    formatDiscountPercent,
    formatNumber,
};

const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value);
};

export {
    formatCurrency
};

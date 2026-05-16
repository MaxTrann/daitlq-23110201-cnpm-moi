const buildProductProjection = (product) => {
    const item = product.toObject ? product.toObject({ virtuals: true }) : product;
    const brand = item.brandId && typeof item.brandId === "object"
        ? {
            _id: item.brandId._id,
            name: item.brandId.name,
            slug: item.brandId.slug,
            logo: item.brandId.logo
        }
        : item.brand || null;

    const category = item.category && typeof item.category === "object"
        ? {
            _id: item.category._id,
            name: item.category.name,
            slug: item.category.slug,
            categoryKind: item.category.categoryKind
        }
        : item.category;

    const medicineDetail = item.medicineDetail
        ? (item.medicineDetail.toObject ? item.medicineDetail.toObject() : item.medicineDetail)
        : null;

    return {
        ...item,
        brandId: brand?._id || item.brandId,
        brand,
        category,
        medicineDetail,
        currentPrice: item.salePrice || item.price
    };
};

module.exports = {
    buildProductProjection
};

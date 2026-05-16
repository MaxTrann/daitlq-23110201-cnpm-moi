const Product = require("../../models/product");
const Category = require("../../models/category");
const Brand = require("../../models/brand");
const User = require("../../models/user");

const LOW_STOCK_THRESHOLD = 10;

const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const buildRevenueLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);
        const labelIndex = date.getDay();
        days.push({
            date: date.toISOString().slice(0, 10),
            label: `${dayLabels[labelIndex]} (${date.getDate()})`,
            revenue: 0,
        });
    }
    return days;
};

const getDashboardStatsService = async () => {
    const [products, totalCustomers, totalCategories, totalBrands] = await Promise.all([
        Product.find({}),
        User.countDocuments({ role: "User" }),
        Category.countDocuments({ isActive: true }),
        Brand.countDocuments({ isActive: true }),
    ]);

    const activeProducts = products.filter((item) => item.isActive);
    const totalProducts = activeProducts.length;

    let totalRevenue = 0;
    let totalSoldUnits = 0;

    activeProducts.forEach((product) => {
        const unitPrice = product.salePrice ?? product.price ?? 0;
        const sold = product.sold ?? 0;
        totalRevenue += sold * unitPrice;
        totalSoldUnits += sold;
    });

    const lowStockProducts = activeProducts.filter(
        (item) => item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD,
    ).length;

    const outOfStockProducts = activeProducts.filter((item) => item.stock === 0).length;

    const productsWithSales = activeProducts.filter((item) => (item.sold ?? 0) > 0).length;
    const conversionRate =
        totalProducts > 0 ? Number(((productsWithSales / totalProducts) * 100).toFixed(2)) : 0;

    return {
        totalRevenue,
        totalOrders: 0,
        totalSoldUnits,
        totalProducts,
        totalCustomers,
        totalCategories,
        totalBrands,
        pendingOrders: 0,
        lowStockProducts,
        outOfStockProducts,
        todayRevenue: 0,
        conversionRate,
        revenueLast7Days: buildRevenueLast7Days(),
        note: "Doanh thu/đơn hàng theo ngày sẽ cập nhật khi module đơn hàng được triển khai.",
    };
};

module.exports = {
    getDashboardStatsService,
};

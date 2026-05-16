const { getDashboardStatsService } = require("../services/admin/dashboardService");

const getDashboardStats = async (req, res) => {
    try {
        const data = await getDashboardStatsService();
        return res.status(200).json({ EC: 0, EM: "Thành công", data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ EC: 500, EM: "Không thể tải thống kê dashboard" });
    }
};

module.exports = {
    getDashboardStats,
};

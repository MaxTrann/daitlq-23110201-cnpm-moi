import { useEffect, useState } from "react";
import { Spin, Tabs } from "antd";
import { Link } from "react-router-dom";
import StatCard from "../../components/admin/dashboard/StatCard";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import { getDashboardStatsApi } from "../../utils/adminApi";
import { formatCurrency, formatNumber } from "../../utils/format";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStatsApi()
      .then((res) => {
        if (res?.EC === 0 && res?.data) {
          setStats(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" tip="Đang tải dashboard..." />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-center text-[#888]">Không tải được dữ liệu thống kê.</p>;
  }

  return (
    <div className="space-y-5">
      <Tabs
        defaultActiveKey="overview"
        items={[
          {
            key: "overview",
            label: "Tổng quan",
            children: (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard title="Tổng doanh thu (ước tính)" value={formatCurrency(stats.totalRevenue)} />
                  <StatCard title="Tổng đơn hàng" value={formatNumber(stats.totalOrders)} />
                  <StatCard title="Tổng sản phẩm" value={formatNumber(stats.totalProducts)} />
                  <StatCard title="Tổng khách hàng" value={formatNumber(stats.totalCustomers)} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard title="Đơn hàng chờ xử lý" value={formatNumber(stats.pendingOrders)} tone="danger" />
                  <StatCard title="Sản phẩm sắp hết hàng" value={formatNumber(stats.lowStockProducts)} tone="warning" />
                  <StatCard title="Doanh thu hôm nay" value={formatCurrency(stats.todayRevenue)} tone="success" />
                  <StatCard title="Tỷ lệ SP có doanh số" value={`${stats.conversionRate}%`} tone="info" />
                </div>

                <RevenueChart data={stats.revenueLast7Days} />

                <div className="grid gap-4 md:grid-cols-3">
                  <Link
                    to="/admin/products"
                    className="rounded-xl border border-[#e8e8e8] bg-white p-4 shadow-sm transition hover:border-[#0067b8]"
                  >
                    <p className="m-0 font-semibold text-[#0067b8]">Quản lý sản phẩm →</p>
                    <p className="mt-1 mb-0 text-sm text-[#888]">{stats.totalProducts} sản phẩm đang bán</p>
                  </Link>
                  <Link
                    to="/admin/categories"
                    className="rounded-xl border border-[#e8e8e8] bg-white p-4 shadow-sm transition hover:border-[#0067b8]"
                  >
                    <p className="m-0 font-semibold text-[#0067b8]">Quản lý danh mục →</p>
                    <p className="mt-1 mb-0 text-sm text-[#888]">{stats.totalCategories} danh mục</p>
                  </Link>
                  <Link
                    to="/admin/brands"
                    className="rounded-xl border border-[#e8e8e8] bg-white p-4 shadow-sm transition hover:border-[#0067b8]"
                  >
                    <p className="m-0 font-semibold text-[#0067b8]">Quản lý thương hiệu →</p>
                    <p className="mt-1 mb-0 text-sm text-[#888]">{stats.totalBrands} thương hiệu</p>
                  </Link>
                </div>

                {stats.note && <p className="text-xs text-[#999]">{stats.note}</p>}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AdminDashboardPage;

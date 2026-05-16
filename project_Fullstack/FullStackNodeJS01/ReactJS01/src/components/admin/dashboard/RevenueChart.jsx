const RevenueChart = ({ data = [] }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const chartHeight = 200;

  return (
    <div className="rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0 text-base font-bold text-[#333]">📈 Doanh thu 7 ngày gần nhất</h3>
        <span className="text-xs text-[#888]">Sẽ cập nhật khi có module đơn hàng</span>
      </div>
      <div className="flex items-end justify-between gap-2" style={{ height: chartHeight }}>
        {data.map((item) => {
          const barHeight = item.revenue > 0 ? Math.max((item.revenue / maxRevenue) * chartHeight, 8) : 4;
          return (
            <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full max-w-[48px] rounded-t-md bg-[#0067b8]/80"
                style={{ height: barHeight }}
                title={`${item.revenue.toLocaleString("vi-VN")} đ`}
              />
              <span className="text-center text-[10px] text-[#888] md:text-xs">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;

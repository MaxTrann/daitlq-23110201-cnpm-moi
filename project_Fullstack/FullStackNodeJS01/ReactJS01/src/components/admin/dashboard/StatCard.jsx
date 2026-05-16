const toneClass = {
  default: "text-[#333]",
  danger: "text-[#e31e24]",
  warning: "text-[#fa8c16]",
  success: "text-[#52c41a]",
  info: "text-[#13c2c2]",
};

const StatCard = ({ title, value, tone = "default" }) => (
  <div className="rounded-xl border border-[#e8e8e8] bg-white p-4 shadow-sm">
    <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[#888]">{title}</p>
    <p className={`mt-2 m-0 text-2xl font-bold ${toneClass[tone] || toneClass.default}`}>{value}</p>
  </div>
);

export default StatCard;

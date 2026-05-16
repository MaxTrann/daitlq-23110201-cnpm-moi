import { Link } from "react-router-dom";

const services = [
  { icon: "📋", label: "Đặt đơn thuốc", to: "/products?drugClass=rx", desc: "Upload đơn (demo)" },
  { icon: "💬", label: "Liên hệ dược sĩ", to: "tel:18006928", desc: "Tư vấn miễn phí" },
  { icon: "🏪", label: "Tìm nhà thuốc", to: "/products", desc: "Hệ thống MedCare" },
  { icon: "🎁", label: "Khuyến mãi", to: "/products?isSale=true", desc: "Deal hot" },
  { icon: "💊", label: "Thuốc OTC", to: "/products?drugClass=otc", desc: "Mua online" },
  { icon: "🌿", label: "TPCN", to: "/products?productType=functional_food", desc: "Bổ sung sức khỏe" },
];

const QuickServices = () => (
  <section className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:gap-3">
    {services.map((item) => {
      const isExternal = item.to.startsWith("tel:");
      const className =
        "flex flex-col items-center rounded-lg border border-[#e5e7eb] bg-white p-3 text-center transition hover:border-[#0067b8] hover:shadow-md";

      const content = (
        <>
          <span className="text-2xl md:text-3xl">{item.icon}</span>
          <span className="mt-2 text-xs font-semibold text-[#333] md:text-sm">{item.label}</span>
          <span className="mt-0.5 hidden text-[10px] text-[#888] sm:block">{item.desc}</span>
        </>
      );

      return isExternal ? (
        <a key={item.label} href={item.to} className={className}>
          {content}
        </a>
      ) : (
        <Link key={item.label} to={item.to} className={className}>
          {content}
        </Link>
      );
    })}
  </section>
);

export default QuickServices;

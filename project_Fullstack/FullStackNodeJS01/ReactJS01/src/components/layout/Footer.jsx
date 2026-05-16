import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-12 border-t border-[#ddd] bg-white">
    <div className="pc-container grid gap-8 py-10 md:grid-cols-4">
      <div>
        <p className="text-xl font-bold text-[#0067b8]">MedCare</p>
        <p className="mt-2 text-sm text-[#666]">
          Đúng thuốc, tận tâm, giá tốt — Nhà thuốc trực tuyến cho gia đình bạn.
        </p>
      </div>
      <div>
        <p className="font-bold text-[#333]">Hỗ trợ khách hàng</p>
        <ul className="mt-3 list-none space-y-2 p-0 text-sm text-[#666]">
          <li>Hotline: 1800 6928</li>
          <li>Email: support@medcare.vn</li>
          <li>8:00 - 22:00 hàng ngày</li>
        </ul>
      </div>
      <div>
        <p className="font-bold text-[#333]">Danh mục</p>
        <ul className="mt-3 list-none space-y-2 p-0 text-sm">
          <li>
            <Link to="/products" className="text-[#0067b8] hover:underline">
              Tất cả sản phẩm
            </Link>
          </li>
          <li>
            <Link to="/products?isSale=true" className="text-[#0067b8] hover:underline">
              Khuyến mãi
            </Link>
          </li>
          <li>
            <Link to="/products?drugClass=otc" className="text-[#0067b8] hover:underline">
              Thuốc không kê đơn
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <p className="font-bold text-[#333]">Lưu ý</p>
        <p className="mt-3 text-xs leading-6 text-[#888]">
          Thông tin trên website chỉ mang tính tham khảo, không thay tư vấn trực tiếp của dược sĩ/bác sĩ. Thuốc kê
          đơn cần có đơn hợp lệ.
        </p>
      </div>
    </div>
    <div className="border-t border-[#eee] bg-[#f4f6f8] py-4 text-center text-xs text-[#888]">
      © {new Date().getFullYear()} MedCare — Đồ án CNPM
    </div>
  </footer>
);

export default Footer;

import { Link } from "react-router-dom";

const widthClass = {
  default: "max-w-md",
  wide: "max-w-xl",
};

const AuthShell = ({ title, subtitle, children, size = "default" }) => (
  <div className="min-h-screen bg-[#f4f6f8]">
    <div className="bg-[#004a85] py-3 text-center text-sm text-white">
      <span className="font-semibold">MedCare</span> — Đúng thuốc, tận tâm, giá tốt
    </div>
    <div className="pc-container flex justify-center py-10">
      <div
        className={`w-full ${widthClass[size] || widthClass.default} rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-md md:p-8`}
      >
        <Link to="/home" className="mb-4 inline-flex items-center text-sm font-medium text-[#0067b8] hover:underline">
          ← Về trang chủ
        </Link>
        <h1 className="m-0 text-2xl font-bold text-[#004a85]">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-[#666]">{subtitle}</p>}
        <div className="mt-6 auth-form">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthShell;

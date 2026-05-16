import { Link, useLocation } from "react-router-dom";

const userNav = [
  { to: "/user/profile", label: "Hồ sơ cá nhân" },
  { to: "/products", label: "Mua sắm" },
];

const adminNav = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Quản lý sản phẩm" },
  { to: "/admin/categories", label: "Danh mục" },
  { to: "/admin/brands", label: "Thương hiệu" },
];

const AccountShell = ({ title, description, role = "User", children }) => {
  const location = useLocation();
  const navItems = role === "Admin" ? adminNav : userNav;

  return (
    <div className="pb-8">
      <div className="border-b border-[#e5e7eb] bg-white py-3">
        <div className="pc-container pc-breadcrumb">
          <Link to="/home">Trang chủ</Link>
          <span> / </span>
          <span>{title}</span>
        </div>
      </div>

      <div className="pc-container py-6">
        <div className="mb-5">
          <h1 className="m-0 text-xl font-bold text-[#004a85] md:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-[#666]">{description}</p>}
        </div>

        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-lg border border-[#e5e7eb] bg-white p-3 shadow-sm">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-[#888]">Tài khoản</p>
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-[#0067b8] text-white"
                        : "text-[#333] hover:bg-[#e8f4fc] hover:text-[#0067b8]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountShell;

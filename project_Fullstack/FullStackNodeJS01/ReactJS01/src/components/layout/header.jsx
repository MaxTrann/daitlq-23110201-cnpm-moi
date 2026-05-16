import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import TopBar from "./TopBar";
import CategoryNav from "./CategoryNav";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: { id: "", email: "", name: "", role: "" },
    });
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/products?keyword=${encodeURIComponent(q)}` : "/products");
  };

  const profileTo =
    auth?.user?.role === "Admin" ? "/admin/profile" : auth?.isAuthenticated ? "/user/profile" : "/login";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <TopBar />

      <div className="border-b border-[#e5e7eb]">
        <div className="pc-container flex flex-wrap items-center gap-4 py-3">
          <Link to="/home" className="flex shrink-0 items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0067b8] text-lg font-extrabold text-white">
              MC
            </span>
            <span className="hidden sm:block">
              <span className="block text-lg font-bold leading-tight text-[#0067b8]">MedCare</span>
              <span className="block text-[10px] font-medium text-[#888]">Đúng thuốc, tận tâm, giá tốt</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex min-w-0 flex-1 max-w-2xl">
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm thuốc, TPCN, thiết bị y tế..."
              className="pc-input-search min-w-0"
            />
            <button type="submit" className="rounded-r-lg bg-[#0067b8] px-5 text-sm font-semibold text-white hover:bg-[#005299]">
              Tìm kiếm
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-2 md:gap-4">
            <Link to={profileTo} className="hidden flex-col items-center text-center sm:flex">
              <span className="text-xl">👤</span>
              <span className="text-[10px] font-medium text-[#666]">
                {auth?.isAuthenticated ? "Tài khoản" : "Đăng nhập"}
              </span>
            </Link>

            <button
              type="button"
              className="hidden flex-col items-center text-center sm:flex"
              onClick={() => navigate("/products")}
            >
              <span className="text-xl">🛒</span>
              <span className="text-[10px] font-medium text-[#666]">Giỏ hàng</span>
            </button>

            {auth?.user?.role === "Admin" && (
              <Link
                to="/admin/dashboard"
                className="rounded-md bg-[#e8f4fc] px-3 py-2 text-xs font-semibold text-[#0067b8] hover:bg-[#0067b8] hover:text-white"
              >
                Quản trị
              </Link>
            )}

            {auth?.isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-[#ddd] px-3 py-2 text-xs font-medium text-[#666] hover:border-[#0067b8] hover:text-[#0067b8]"
              >
                Đăng xuất
              </button>
            ) : (
              <Link to="/login" className="pc-btn-primary px-4 py-2 text-sm">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      <CategoryNav />
    </header>
  );
};

export default Header;

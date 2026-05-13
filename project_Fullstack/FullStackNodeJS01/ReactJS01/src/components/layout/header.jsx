import React, { useContext, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuth } = useContext(AuthContext);
    const [keyword, setKeyword] = useState("");
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);

    const navItems = useMemo(() => ([
        { label: "Trang chủ", to: "/home" },
        { label: "Sản phẩm", to: "/products" },
        { label: "Khuyến mãi", to: "/products?isSale=true" },
        { label: "Liên hệ", to: "mailto:support@campusshop.vn", external: true }
    ]), []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: {
                id: "",
                email: "",
                name: "",
                role: ""
            }
        });
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = keyword.trim();
        navigate(searchValue ? `/products?keyword=${encodeURIComponent(searchValue)}` : "/products");
    };

    const isActiveNav = (url) => {
        if (url.includes("?")) {
            return location.pathname + location.search === url;
        }
        return location.pathname === url;
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center justify-between gap-4">
                    <Link to="/home" className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-white shadow-lg shadow-emerald-200">
                            CS
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg font-bold text-slate-900">Campus Shop</p>
                            <p className="text-xs text-slate-500">Storefront cho sinh viên</p>
                        </div>
                    </Link>

                    {auth?.isAuthenticated && (
                        <div className="hidden min-w-[170px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 lg:block">
                            <p className="truncate font-semibold text-slate-900">{auth?.user?.name || "Thành viên"}</p>
                            <p className="truncate text-xs">{auth?.user?.email}</p>
                        </div>
                    )}
                </div>

                <nav className="flex flex-wrap items-center gap-2 lg:flex-1 lg:justify-center">
                    {navItems.map((item) => {
                        const className = `rounded-full px-4 py-2 text-sm font-medium transition ${!item.external && isActiveNav(item.to)
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`;

                        if (item.external) {
                            return (
                                <a key={item.label} href={item.to} className={className}>
                                    {item.label}
                                </a>
                            );
                        }

                        return (
                            <Link key={item.label} to={item.to} className={className}>
                                {item.label}
                            </Link>
                        );
                    })}

                    {auth?.user?.role === "Admin" && (
                        <div
                            className="relative"
                            onMouseEnter={() => setAdminMenuOpen(true)}
                            onMouseLeave={() => setAdminMenuOpen(false)}
                        >
                            <Button
                                type="button"
                                variant="dark"
                                className="px-4 py-2"
                                onClick={() => setAdminMenuOpen((prev) => !prev)}
                            >
                                <span>Quản trị</span>
                                <svg
                                    className={`ml-2 h-4 w-4 transition ${adminMenuOpen ? "rotate-180" : ""}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </Button>

                            {adminMenuOpen && (
                                <div className="absolute left-0 top-full z-50 min-w-[220px] pt-2">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                        <Link
                                            to="/admin/products"
                                            onClick={() => setAdminMenuOpen(false)}
                                            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                            Quản lý sản phẩm
                                        </Link>
                                        <Link
                                            to="/admin/categories"
                                            onClick={() => setAdminMenuOpen(false)}
                                            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                            Quản lý danh mục
                                        </Link>
                                        <Link
                                            to="/user"
                                            onClick={() => setAdminMenuOpen(false)}
                                            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                            Quản lý user
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
                    <form onSubmit={handleSearch} className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 lg:max-w-[260px]">
                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm sản phẩm nhanh..."
                            className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none"
                        />
                        <Button type="submit" variant="primary" className="px-4 py-2 whitespace-nowrap">
                            Tìm
                        </Button>
                    </form>

                    {auth?.isAuthenticated ? (
                        <Button onClick={handleLogout} variant="secondary" className="whitespace-nowrap px-4 py-2">
                            Đăng xuất
                        </Button>
                    ) : (
                        <Button to="/login" variant="dark" className="whitespace-nowrap px-4 py-2">
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
};
export default Header;

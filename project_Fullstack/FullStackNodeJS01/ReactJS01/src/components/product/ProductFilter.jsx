const ProductFilter = ({
    filters,
    categories = [],
    onChange,
    onReset
}) => {
    return (
        <aside className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-lg font-bold text-slate-900">Bộ lọc sản phẩm</p>
                    <p className="text-sm text-slate-500">Lọc nhanh theo nhu cầu mua sắm.</p>
                </div>
                <button onClick={onReset} className="text-sm font-semibold text-rose-500 transition hover:text-rose-600">
                    Đặt lại
                </button>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Danh mục</label>
                <select
                    value={filters.category}
                    onChange={(e) => onChange({ category: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((item) => (
                        <option key={item._id} value={item.slug}>{item.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Khoảng giá</label>
                <div className="space-y-2 text-sm text-slate-600">
                    {[
                        { label: "Tất cả", value: "" },
                        { label: "Dưới 500.000đ", value: "under-500k" },
                        { label: "500.000đ đến 1.000.000đ", value: "500k-1000k" },
                        { label: "Trên 1.000.000đ", value: "over-1000k" }
                    ].map((item) => (
                        <label key={item.value || "all"} className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="priceRange"
                                checked={filters.priceRange === item.value}
                                onChange={() => onChange({ priceRange: item.value })}
                            />
                            <span>{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Tình trạng kho</label>
                <select
                    value={filters.stockStatus}
                    onChange={(e) => onChange({ stockStatus: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                >
                    <option value="">Tất cả</option>
                    <option value="in-stock">Còn hàng</option>
                    <option value="out-of-stock">Hết hàng</option>
                </select>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Sắp xếp</label>
                <select
                    value={filters.sort}
                    onChange={(e) => onChange({ sort: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="best-selling">Bán chạy nhất</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                </select>
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                <input
                    type="checkbox"
                    checked={filters.isSale}
                    onChange={(e) => onChange({ isSale: e.target.checked })}
                />
                Chỉ hiển thị sản phẩm đang khuyến mãi
            </label>
        </aside>
    );
};

export default ProductFilter;

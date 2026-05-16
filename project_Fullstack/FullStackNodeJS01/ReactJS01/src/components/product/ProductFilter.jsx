const inputClass =
  "w-full rounded-md border border-[#e5e7eb] px-3 py-2.5 text-sm outline-none transition focus:border-[#0067b8]";

const ProductFilter = ({ filters, categories = [], brands = [], onChange, onReset }) => (
  <aside className="pc-filter-panel h-fit space-y-4 lg:sticky lg:top-36">
    <div className="flex items-start justify-between gap-3 border-b border-[#eee] pb-3">
      <div>
        <p className="text-base font-bold text-[#004a85]">Bộ lọc</p>
        <p className="text-xs text-[#888]">Thuốc, TPCN, thiết bị</p>
      </div>
      <button type="button" onClick={onReset} className="text-xs font-semibold text-[#e31e24] hover:underline">
        Đặt lại
      </button>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#333]">Loại sản phẩm</label>
      <select
        value={filters.productType || ""}
        onChange={(e) => onChange({ productType: e.target.value })}
        className={inputClass}
      >
        <option value="">Tất cả loại</option>
        <option value="medicine_otc">Thuốc OTC</option>
        <option value="medicine_rx">Thuốc kê đơn</option>
        <option value="functional_food">TPCN</option>
        <option value="medical_device">Thiết bị y tế</option>
      </select>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#333]">Phân loại</label>
      <select value={filters.drugClass || ""} onChange={(e) => onChange({ drugClass: e.target.value })} className={inputClass}>
        <option value="">Tất cả</option>
        <option value="otc">OTC</option>
        <option value="rx">Kê đơn</option>
      </select>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#333]">Thương hiệu</label>
      <select value={filters.brand || ""} onChange={(e) => onChange({ brand: e.target.value })} className={inputClass}>
        <option value="">Tất cả thương hiệu</option>
        {brands.map((item) => (
          <option key={item._id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#333]">Danh mục</label>
      <select value={filters.category} onChange={(e) => onChange({ category: e.target.value })} className={inputClass}>
        <option value="">Tất cả danh mục</option>
        {categories.map((item) => (
          <option key={item._id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#333]">Khoảng giá</label>
      <div className="space-y-1.5 text-sm text-[#555]">
        {[
          { label: "Tất cả", value: "" },
          { label: "Dưới 500.000đ", value: "under-500k" },
          { label: "500.000đ – 1.000.000đ", value: "500k-1000k" },
          { label: "Trên 1.000.000đ", value: "over-1000k" },
        ].map((item) => (
          <label key={item.value || "all"} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="priceRange"
              checked={filters.priceRange === item.value}
              onChange={() => onChange({ priceRange: item.value })}
              className="accent-[#0067b8]"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#333]">Tình trạng kho</label>
      <select
        value={filters.stockStatus}
        onChange={(e) => onChange({ stockStatus: e.target.value })}
        className={inputClass}
      >
        <option value="">Tất cả</option>
        <option value="in-stock">Còn hàng</option>
        <option value="out-of-stock">Hết hàng</option>
      </select>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-semibold text-[#333]">Sắp xếp</label>
      <select value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })} className={inputClass}>
        <option value="newest">Mới nhất</option>
        <option value="best-selling">Bán chạy nhất</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
      </select>
    </div>

    <label className="flex cursor-pointer items-center gap-2 rounded-md bg-[#fff8e6] px-3 py-2.5 text-xs font-medium text-[#b8860b]">
      <input
        type="checkbox"
        checked={filters.isSale}
        onChange={(e) => onChange({ isSale: e.target.checked })}
        className="accent-[#0067b8]"
      />
      Chỉ sản phẩm khuyến mãi
    </label>
  </aside>
);

export default ProductFilter;

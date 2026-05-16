import { notification } from "antd";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import StatusBadge from "../shared/StatusBadge";
import { formatCurrency, formatNumber } from "../../utils/format";
import ProductImageSlider from "./ProductImageSlider";
import QuantitySelector from "./QuantitySelector";

const ProductDetail = ({ product, quantity, onQuantityChange }) => {
  const isOutOfStock = product.stock === 0;
  const canBuyOnline = product.allowedOnlineSale !== false;
  const md = product.medicineDetail;

  const handleCartAction = (action) => {
    if (!canBuyOnline) {
      notification.warning({
        message: "Thuốc kê đơn",
        description: "Sản phẩm này cần tư vấn dược sĩ hoặc mua tại nhà thuốc. Liên hệ hotline MedCare.",
      });
      return;
    }
    notification.success({
      message: action,
      description: `Demo: ${quantity} x ${product.name}`,
    });
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <ProductImageSlider images={product.images} />

      <div className="space-y-6 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {product.category?.slug ? (
              <Link
                to={`/products?category=${product.category.slug}`}
                className="inline-flex rounded-full bg-[#e8f4fc] px-3 py-1 text-xs font-semibold text-[#0067b8] hover:bg-[#0067b8] hover:text-white"
              >
                {product.category.name}
              </Link>
            ) : (
              <StatusBadge tone="info">Chưa phân loại</StatusBadge>
            )}
            {product.drugClass === "rx" && <StatusBadge tone="danger">Thuốc kê đơn</StatusBadge>}
            {product.drugClass === "otc" && <StatusBadge tone="success">Không kê đơn (OTC)</StatusBadge>}
            {product.requiresPharmacistAdvice && <StatusBadge tone="warning">Hỏi dược sĩ</StatusBadge>}
          </div>
          <h1 className="text-2xl font-bold text-[#333] md:text-3xl">{product.name}</h1>
          {product.brand?.name && (
            <p className="text-sm text-[#666]">
              Thương hiệu:{" "}
              {product.brand?.slug ? (
                <Link to={`/products?brand=${product.brand.slug}`} className="font-semibold text-[#0067b8] hover:underline">
                  {product.brand.name}
                </Link>
              ) : (
                <span className="font-semibold text-[#0067b8]">{product.brand.name}</span>
              )}
            </p>
          )}
          {product.category?.slug && (
            <p className="text-sm">
              <Link to={`/products?category=${product.category.slug}`} className="text-[#0067b8] hover:underline">
                Xem tất cả trong danh mục «{product.category.name}»
              </Link>
            </p>
          )}
          <p className="leading-7 text-[#666]">{product.description}</p>
          <p className="text-xs text-[#999]">SKU: {product.sku}</p>
        </div>

        {!canBuyOnline && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Thuốc kê đơn: thông tin mang tính tham khảo. Vui lòng mang đơn thuốc đến nhà thuốc hoặc liên hệ dược sĩ MedCare.
          </div>
        )}

        <div className="flex flex-wrap items-end gap-4">
          <p className="text-3xl font-bold text-[#0067b8]">{formatCurrency(product.salePrice || product.price)}</p>
          {product.salePrice && <p className="text-lg text-[#999] line-through">{formatCurrency(product.price)}</p>}
        </div>

        <div className="grid gap-4 rounded-lg bg-[#f4f6f8] p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Quy cách</p>
            <p className="mt-1 font-bold text-slate-900">
              {product.unitLabel}
              {product.packagingDescription ? ` · ${product.packagingDescription}` : ""}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#666]">Tồn kho</p>
            <p className="mt-1 text-lg font-bold text-[#333]">{product.stock}</p>
          </div>
          <div>
            <p className="text-sm text-[#666]">Đã bán</p>
            <p className="mt-1 text-lg font-bold text-[#0067b8]">{formatNumber(product.sold ?? 0)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Tình trạng</p>
            <div className="mt-2">
              <StatusBadge tone={isOutOfStock ? "danger" : "success"}>{isOutOfStock ? "Hết hàng" : "Còn hàng"}</StatusBadge>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500">Mua online</p>
            <div className="mt-2">
              <StatusBadge tone={canBuyOnline ? "success" : "neutral"}>
                {canBuyOnline ? "Được phép" : "Chỉ tại nhà thuốc"}
              </StatusBadge>
            </div>
          </div>
        </div>

        {md && (
          <div className="space-y-3 rounded-lg border border-[#d0e8f7] bg-[#e8f4fc] p-5">
            <h2 className="text-lg font-bold text-[#004a85]">Thông tin dược phẩm</h2>
            {md.activeIngredient && <p className="text-sm text-slate-700"><strong>Hoạt chất:</strong> {md.activeIngredient}</p>}
            {md.registrationNo && <p className="text-sm text-slate-700"><strong>Số đăng ký:</strong> {md.registrationNo}</p>}
            {md.indications && <p className="text-sm text-slate-700"><strong>Công dụng:</strong> {md.indications}</p>}
            {md.usage && <p className="text-sm text-slate-700"><strong>Cách dùng:</strong> {md.usage}</p>}
            {md.warnings && <p className="text-sm text-amber-800"><strong>Cảnh báo:</strong> {md.warnings}</p>}
            {md.storage && <p className="text-sm text-slate-600"><strong>Bảo quản:</strong> {md.storage}</p>}
          </div>
        )}

        <p className="text-xs leading-5 text-slate-400">
          Thông tin chỉ mang tính tham khảo, không thay thế tư vấn của dược sĩ/bác sĩ. Khẩn cấp y tế gọi 115.
        </p>

        <div className="space-y-4">
          {canBuyOnline && (
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">Chọn số lượng</p>
              <QuantitySelector value={quantity} onChange={onQuantityChange} max={product.stock} disabled={isOutOfStock} />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={isOutOfStock || !canBuyOnline}
              variant="secondary"
              className="rounded-2xl px-6 py-4"
              onClick={() => handleCartAction("Giỏ hàng")}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              disabled={isOutOfStock || !canBuyOnline}
              variant="primary"
              className="rounded-2xl px-6 py-4"
              onClick={() => handleCartAction("Mua ngay")}
            >
              Mua ngay
            </Button>
            {!canBuyOnline && (
              <Button variant="outline" className="rounded-2xl px-6 py-4" href="tel:18006928">
                Gọi dược sĩ
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

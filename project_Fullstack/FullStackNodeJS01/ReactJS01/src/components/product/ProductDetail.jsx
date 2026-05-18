import { notification } from "antd";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import StatusBadge from "../shared/StatusBadge";
import { formatCurrency, formatNumber } from "../../utils/format";
import ProductImageSlider from "./ProductImageSlider";
import QuantitySelector from "./QuantitySelector";

const MEDCARE_HOTLINE = "tel:18006928";

const PharmacistIcon = () => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg" aria-hidden>
    💊
  </span>
);

const PrescriptionIcon = () => (
  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/80 text-3xl shadow-sm" aria-hidden>
    📋
  </span>
);

const ProductDetail = ({ product, quantity, onQuantityChange }) => {
  const isOutOfStock = product.stock === 0;
  const canBuyOnline = product.allowedOnlineSale !== false;
  const needsPharmacistAdvice = product.requiresPharmacistAdvice === true;
  const md = product.medicineDetail;

  const handleCartAction = (action) => {
    if (!canBuyOnline || needsPharmacistAdvice) {
      notification.warning({
        message: "Cần tư vấn dược sĩ",
        description: "Sản phẩm này cần tư vấn dược sĩ hoặc mua tại nhà thuốc. Liên hệ hotline MedCare 1800 6928.",
      });
      return;
    }
    notification.success({
      message: action,
      description: `Demo: ${quantity} x ${product.name}`,
    });
  };

  const handlePrescriptionOrder = () => {
    notification.info({
      message: "Đặt thuốc theo toa",
      description: "Tính năng tải đơn thuốc đang được phát triển. Vui lòng gọi hotline 1800 6928 để được dược sĩ hỗ trợ.",
    });
  };

  const handleFindPharmacy = () => {
    notification.info({
      message: "Tìm nhà thuốc",
      description: "Liên hệ hotline 1800 6928 hoặc đến chi nhánh MedCare gần bạn.",
    });
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
      <div className="product-detail-gallery lg:sticky lg:top-20 lg:self-start">
        <ProductImageSlider images={product.images} />
      </div>

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
            {needsPharmacistAdvice && (
              <StatusBadge tone="warning">Cần tư vấn dược sĩ</StatusBadge>
            )}
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
          <p className="text-xs text-[#999]">
            Mã: <span className="font-medium text-[#666]">{product.sku}</span>
          </p>
          {md?.registrationNo && (
            <p className="text-sm text-[#666]">
              Số đăng ký: <span className="font-medium text-[#333]">{md.registrationNo}</span>
            </p>
          )}
          {product.shortDescription && (
            <p className="text-sm leading-7 text-[#666]">{product.shortDescription}</p>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <p className="text-3xl font-bold text-[#0067b8]">{formatCurrency(product.salePrice || product.price)}</p>
          {product.salePrice && (
            <p className="text-lg text-[#999] line-through">{formatCurrency(product.price)}</p>
          )}
        </div>

        {product.unitLabel && (
          <div>
            <p className="mb-2 text-sm font-semibold text-[#333]">Phân loại sản phẩm</p>
            <span className="inline-flex rounded-md border-2 border-[#0067b8] bg-[#e8f4fc] px-4 py-2 text-sm font-semibold text-[#0067b8]">
              {product.unitLabel}
              {product.packagingDescription ? ` · ${product.packagingDescription}` : ""}
            </span>
          </div>
        )}

        {needsPharmacistAdvice && (
          <div className="overflow-hidden rounded-xl border border-[#b8d4f0] bg-gradient-to-br from-[#e8f4fc] to-[#f0f7fc] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-[#004a85]">Đặt thuốc theo toa</h2>
                <p className="max-w-md text-sm leading-6 text-[#555]">
                  Tải lên đơn thuốc của bạn để nhận sự tư vấn và hỗ trợ từ các dược sĩ của chúng tôi.
                </p>
                <Button
                  variant="primary"
                  className="mt-1 rounded-lg px-6"
                  onClick={handlePrescriptionOrder}
                  disabled={isOutOfStock}
                >
                  Đặt ngay
                </Button>
              </div>
              <PrescriptionIcon />
            </div>
          </div>
        )}

        <div className="grid gap-4 rounded-lg bg-[#f4f6f8] p-5 sm:grid-cols-2 lg:grid-cols-3">
          {!needsPharmacistAdvice && (
            <div>
              <p className="text-sm text-slate-500">Quy cách</p>
              <p className="mt-1 font-bold text-slate-900">
                {product.unitLabel}
                {product.packagingDescription ? ` · ${product.packagingDescription}` : ""}
              </p>
            </div>
          )}
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
              <StatusBadge tone={isOutOfStock ? "danger" : "success"}>
                {isOutOfStock ? "Hết hàng" : "Còn hàng"}
              </StatusBadge>
            </div>
          </div>
          {!needsPharmacistAdvice && (
            <div>
              <p className="text-sm text-slate-500">Mua online</p>
              <div className="mt-2">
                <StatusBadge tone={canBuyOnline ? "success" : "neutral"}>
                  {canBuyOnline ? "Được phép" : "Chỉ tại nhà thuốc"}
                </StatusBadge>
              </div>
            </div>
          )}
        </div>

        {md && (
          <div className="space-y-3 rounded-lg border border-[#d0e8f7] bg-[#e8f4fc] p-5">
            <h2 className="text-lg font-bold text-[#004a85]">Thông tin chi tiết</h2>
            {product.category?.name && (
              <p className="text-sm text-slate-700">
                <strong>Danh mục:</strong> {product.category.name}
              </p>
            )}
            {product.brand?.name && (
              <p className="text-sm text-slate-700">
                <strong>Nhà sản xuất:</strong> {product.brand.name}
              </p>
            )}
            {md.activeIngredient && (
              <p className="text-sm text-slate-700">
                <strong>Hoạt chất:</strong> {md.activeIngredient}
              </p>
            )}
            <p className="text-xs text-slate-500">
              Xem thêm mục Mô tả, Chỉ định, Cách sử dụng… bên dưới trang.
            </p>
          </div>
        )}

        {!canBuyOnline && !needsPharmacistAdvice && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Thuốc kê đơn: thông tin mang tính tham khảo. Vui lòng mang đơn thuốc đến nhà thuốc hoặc liên hệ dược sĩ MedCare.
          </div>
        )}

        <p className="text-xs leading-5 text-slate-400">
          Thông tin chỉ mang tính tham khảo, không thay thế tư vấn của dược sĩ/bác sĩ. Khẩn cấp y tế gọi 115.
        </p>

        {needsPharmacistAdvice ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-[#ffd591] bg-[#fffbe6] px-4 py-3">
              <PharmacistIcon />
              <p className="text-sm font-medium text-[#ad6800]">Sản phẩm cần tư vấn từ dược sĩ</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1 rounded-lg px-6 py-4"
                onClick={handleFindPharmacy}
                disabled={isOutOfStock}
              >
                Tìm nhà thuốc
              </Button>
              <Button
                variant="primary"
                className="flex-1 rounded-lg px-6 py-4"
                href={MEDCARE_HOTLINE}
                disabled={isOutOfStock}
              >
                Tư vấn ngay
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {canBuyOnline && (
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-700">Chọn số lượng</p>
                <QuantitySelector
                  value={quantity}
                  onChange={onQuantityChange}
                  max={product.stock}
                  disabled={isOutOfStock}
                />
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
                <Button variant="outline" className="rounded-2xl px-6 py-4" href={MEDCARE_HOTLINE}>
                  Gọi dược sĩ
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;

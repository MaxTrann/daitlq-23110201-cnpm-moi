import { Link } from "react-router-dom";
import { formatCurrency, formatDiscountPercent } from "../../utils/format";

const ProductCard = ({ product }) => {
  const price = product?.price || 0;
  const salePrice = product?.salePrice;
  const currentPrice = salePrice || price;
  const discount = formatDiscountPercent(price, salePrice);
  const canBuyOnline = product?.allowedOnlineSale !== false;
  const outOfStock = !product?.stock;

  return (
    <article className="pc-product-card group">
      <Link to={`/products/${product?._id}`} className="relative block aspect-square overflow-hidden bg-[#fafafa] p-3">
        {discount > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded bg-[#e31e24] px-1.5 py-0.5 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}
        {product?.drugClass === "rx" && (
          <span className="absolute right-2 top-2 z-10 rounded bg-[#004a85] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Kê đơn
          </span>
        )}
        <img
          src={product?.images?.[0] || "https://picsum.photos/seed/medcare-product/400/400"}
          alt={product?.name}
          className="mx-auto h-full w-full object-contain transition group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-3 pt-0">
        <Link to={`/products/${product?._id}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-[#333] hover:text-[#0067b8]">
          {product?.name}
        </Link>

        {product?.unitLabel && (
          <p className="mt-1 text-[11px] text-[#888]">{product.unitLabel}</p>
        )}

        <div className="mt-auto pt-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base font-bold text-[#0067b8]">{formatCurrency(currentPrice)}</span>
            {salePrice && (
              <span className="text-xs text-[#999] line-through">{formatCurrency(price)}</span>
            )}
          </div>

          <Link
            to={`/products/${product?._id}`}
            className={`mt-2 block w-full rounded-md py-2 text-center text-xs font-semibold transition ${
              outOfStock
                ? "cursor-not-allowed bg-[#eee] text-[#999]"
                : "bg-[#0067b8] text-white hover:bg-[#005299]"
            }`}
            onClick={(e) => outOfStock && e.preventDefault()}
          >
            {outOfStock ? "Hết hàng" : canBuyOnline ? "Chọn mua" : "Tra cứu"}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

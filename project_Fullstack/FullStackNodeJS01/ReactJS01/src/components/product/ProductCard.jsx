import { formatCurrency } from "../../util/format";
import Button from "../common/Button";
import StatusBadge from "../shared/StatusBadge";

const ProductCard = ({ product }) => {
    const currentPrice = product?.salePrice || product?.price || 0;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative overflow-hidden bg-slate-100">
                <img
                    src={product?.images?.[0] || "https://picsum.photos/seed/fallback-product/800/600"}
                    alt={product?.name}
                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {product?.isNew && <StatusBadge tone="info">Mới</StatusBadge>}
                    {product?.isBestSeller && <StatusBadge tone="warning">Bán chạy</StatusBadge>}
                    {product?.isSale && <StatusBadge tone="danger">Khuyến mãi</StatusBadge>}
                </div>
            </div>

            <div className="flex flex-1 flex-col space-y-4 p-5">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                        {product?.category?.name || "Chưa phân loại"}
                    </p>
                    <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{product?.name}</h3>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-500">{product?.description}</p>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <p className="text-xl font-bold text-slate-900">{formatCurrency(currentPrice)}</p>
                            {product?.salePrice && (
                                <p className="text-sm text-slate-400 line-through">{formatCurrency(product?.price)}</p>
                            )}
                        </div>
                        <div className="text-right text-xs text-slate-500">
                            <p>Tồn kho: <span className="font-semibold text-slate-700">{product?.stock}</span></p>
                            <p>Đã bán: <span className="font-semibold text-slate-700">{product?.sold}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <StatusBadge tone={product?.stock > 0 ? "success" : "danger"}>
                            {product?.stock > 0 ? "Còn hàng" : "Hết hàng"}
                        </StatusBadge>
                        <Button to={`/products/${product?._id}`} variant="dark" className="px-4 py-2">
                            Xem chi tiết
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;

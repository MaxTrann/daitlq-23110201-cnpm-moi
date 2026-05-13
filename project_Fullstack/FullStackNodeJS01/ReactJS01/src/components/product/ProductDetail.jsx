import { notification } from "antd";
import Button from "../common/Button";
import StatusBadge from "../shared/StatusBadge";
import { formatCurrency } from "../../util/format";
import ProductImageSlider from "./ProductImageSlider";
import QuantitySelector from "./QuantitySelector";

const ProductDetail = ({ product, quantity, onQuantityChange }) => {
    const isOutOfStock = product.stock === 0;

    return (
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <ProductImageSlider images={product.images} />

            <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="space-y-3">
                    <StatusBadge tone="info">{product.category?.name || "Chưa phân loại"}</StatusBadge>
                    <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
                    <p className="leading-7 text-slate-500">{product.description}</p>
                </div>

                <div className="flex flex-wrap items-end gap-4">
                    <p className="text-3xl font-black text-slate-900">{formatCurrency(product.salePrice || product.price)}</p>
                    {product.salePrice && (
                        <p className="text-lg text-slate-400 line-through">{formatCurrency(product.price)}</p>
                    )}
                </div>

                <div className="grid gap-4 rounded-3xl bg-slate-50 p-5 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-slate-500">Tồn kho</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{product.stock}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Đã bán</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{product.sold}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Tình trạng</p>
                        <div className="mt-2">
                            <StatusBadge tone={isOutOfStock ? "danger" : "success"}>
                                {isOutOfStock ? "Hết hàng" : "Còn hàng"}
                            </StatusBadge>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Khuyến mãi</p>
                        <div className="mt-2">
                            <StatusBadge tone={product.isSale ? "warning" : "neutral"}>
                                {product.isSale ? "Đang giảm giá" : "Giá tiêu chuẩn"}
                            </StatusBadge>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="mb-3 text-sm font-semibold text-slate-700">Chọn số lượng</p>
                        <QuantitySelector
                            value={quantity}
                            onChange={onQuantityChange}
                            max={product.stock}
                            disabled={isOutOfStock}
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            disabled={isOutOfStock}
                            variant="secondary"
                            className="rounded-2xl px-6 py-4"
                            onClick={() => notification.success({
                                message: "Giỏ hàng demo",
                                description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng demo.`
                            })}
                        >
                            Thêm vào giỏ hàng
                        </Button>
                        <Button
                            disabled={isOutOfStock}
                            variant="primary"
                            className="rounded-2xl px-6 py-4"
                            onClick={() => notification.success({
                                message: "Mua ngay",
                                description: `Demo mua ngay với số lượng ${quantity}.`
                            })}
                        >
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetail;

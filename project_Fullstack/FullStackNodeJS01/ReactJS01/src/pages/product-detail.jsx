import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { notification } from "antd";
import ProductDetail from "../components/product/ProductDetail";
import SimilarProducts from "../components/product/SimilarProducts";
import LoadingState from "../components/shared/LoadingState";
import { getProductDetailApi, getProductsApi } from "../util/productApi";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            const res = await getProductDetailApi(id);
            if (res?.message) {
                notification.error({
                    message: "Sản phẩm",
                    description: res.message
                });
                setLoading(false);
                return;
            }

            setProduct(res);
            setQuantity(1);
            setLoading(false);
        };

        fetchProductDetail();
    }, [id]);

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            if (!product?.category?.slug) return;

            const res = await getProductsApi({
                category: product.category.slug,
                sort: "best-selling"
            });

            if (Array.isArray(res)) {
                setSimilarProducts(res.filter((item) => item._id !== product._id).slice(0, 4));
            }
        };

        fetchSimilarProducts();
    }, [product]);

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
                <LoadingState title="Đang tải chi tiết sản phẩm..." />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 md:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <Link to="/home" className="font-medium text-slate-700 hover:text-emerald-600">Trang chủ</Link>
                <span>/</span>
                <Link to="/products" className="font-medium text-slate-700 hover:text-emerald-600">Sản phẩm</Link>
                <span>/</span>
                <span className="text-slate-400">{product.name}</span>
            </div>

            <ProductDetail
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
            />

            <SimilarProducts products={similarProducts} />
        </div>
    );
};

export default ProductDetailPage;

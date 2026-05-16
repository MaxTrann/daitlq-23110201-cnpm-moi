import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { notification } from "antd";
import ProductDetail from "../components/product/ProductDetail";
import SimilarProducts from "../components/product/SimilarProducts";
import LoadingState from "../components/shared/LoadingState";
import { getProductDetailApi, getProductsApi } from "../utils/productApi";

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
          description: res.message,
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
        sort: "best-selling",
      });

      if (Array.isArray(res)) {
        setSimilarProducts(res.filter((item) => item._id !== product._id).slice(0, 5));
      }
    };

    fetchSimilarProducts();
  }, [product]);

  if (loading) {
    return (
      <div className="pc-container py-8">
        <LoadingState title="Đang tải chi tiết sản phẩm..." />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="pb-8">
      <div className="border-b border-[#e5e7eb] bg-white py-3">
        <div className="pc-container pc-breadcrumb">
          <Link to="/home">Trang chủ</Link>
          <span> / </span>
          <Link to="/products">Sản phẩm</Link>
          <span> / </span>
          <span className="text-[#333]">{product.name}</span>
        </div>
      </div>

      <div className="pc-container space-y-8 py-6">
        <ProductDetail product={product} quantity={quantity} onQuantityChange={setQuantity} />
        <SimilarProducts products={similarProducts} />
      </div>
    </div>
  );
};

export default ProductDetailPage;

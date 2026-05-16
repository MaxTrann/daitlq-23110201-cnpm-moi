import { Link } from "react-router-dom";
import ProductGrid from "./ProductGrid";

const SimilarProducts = ({ products = [] }) => {
  if (!products.length) return null;

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm md:p-5">
      <div className="pc-section-title">
        <h2>Sản phẩm tương tự</h2>
        <Link to="/products">Xem thêm →</Link>
      </div>
      <ProductGrid products={products} compact />
    </section>
  );
};

export default SimilarProducts;

import { Link } from "react-router-dom";
import ProductGrid from "../product/ProductGrid";

const ProductSection = ({ title, viewAllTo = "/products", products = [] }) => (
  <section className="rounded-lg bg-white p-4 shadow-sm md:p-5">
    <div className="pc-section-title">
      <h2>{title}</h2>
      <Link to={viewAllTo}>Xem tất cả →</Link>
    </div>
    <ProductGrid products={products} compact />
  </section>
);

export default ProductSection;

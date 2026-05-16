import EmptyState from "../shared/EmptyState";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [], compact = false }) => {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Chưa có sản phẩm phù hợp"
        description="Hãy thử thay đổi bộ lọc hoặc quay lại sau khi cập nhật danh mục."
      />
    );
  }

  const gridClass = compact
    ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

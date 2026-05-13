import EmptyState from "../shared/EmptyState";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [] }) => {
    if (products.length === 0) {
        return (
            <EmptyState
                title="Chưa có sản phẩm phù hợp"
                description="Hãy thử thay đổi bộ lọc hoặc quay lại sau khi quản trị viên cập nhật dữ liệu."
            />
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;

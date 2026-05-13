import SectionHeader from "../shared/SectionHeader";
import ProductGrid from "./ProductGrid";

const SimilarProducts = ({ products = [] }) => {
    return (
        <section className="space-y-6">
            <SectionHeader
                eyebrow="Gợi ý thêm"
                title="Sản phẩm tương tự"
                description="Những sản phẩm cùng danh mục giúp bạn có thêm lựa chọn phù hợp."
            />
            <ProductGrid products={products} />
        </section>
    );
};

export default SimilarProducts;

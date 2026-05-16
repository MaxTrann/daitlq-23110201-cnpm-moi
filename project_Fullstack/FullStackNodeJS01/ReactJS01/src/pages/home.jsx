import { useEffect, useState } from "react";
import HeroSlider from "../components/home/HeroSlider";
import QuickServices from "../components/home/QuickServices";
import CategoryShortcut from "../components/home/CategoryShortcut";
import ProductSection from "../components/home/ProductSection";
import LoadingState from "../components/shared/LoadingState";
import { getProductsApi } from "../utils/productApi";

const HomePage = () => {
  const [sections, setSections] = useState({
    newest: [],
    bestSeller: [],
    sale: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      setLoading(true);
      const [newest, bestSeller, sale] = await Promise.all([
        getProductsApi({ sort: "newest" }),
        getProductsApi({ sort: "best-selling" }),
        getProductsApi({ isSale: true, sort: "newest" }),
      ]);

      setSections({
        newest: Array.isArray(newest) ? newest.slice(0, 10) : [],
        bestSeller: Array.isArray(bestSeller) ? bestSeller.slice(0, 10) : [],
        sale: Array.isArray(sale) ? sale.slice(0, 10) : [],
      });
      setLoading(false);
    };

    fetchHomeProducts();
  }, []);

  return (
    <div className="pb-8">
      <div className="pc-container space-y-5 py-4">
        <HeroSlider />
        <QuickServices />
        <CategoryShortcut />

        {loading ? (
          <LoadingState title="Đang tải sản phẩm..." />
        ) : (
          <>
            <ProductSection title="Sản phẩm mới" products={sections.newest} viewAllTo="/products?sort=newest" />
            <ProductSection
              title="Bán chạy nhất"
              products={sections.bestSeller}
              viewAllTo="/products?sort=best-selling"
            />
            <ProductSection title="Khuyến mãi hot" products={sections.sale} viewAllTo="/products?isSale=true" />
          </>
        )}

        <section className="grid gap-4 rounded-lg bg-gradient-to-r from-[#0067b8] to-[#00a0e9] p-6 text-white md:grid-cols-2 md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide opacity-90">Tư vấn dược sĩ</p>
            <h2 className="mt-2 text-xl font-bold md:text-2xl">Cần hỗ trợ chọn thuốc an toàn?</h2>
            <p className="mt-2 text-sm opacity-90">
              MedCare kết nối dược sĩ 8:00–22:00. Thuốc kê đơn vui lòng mang đơn đến nhà thuốc hoặc gọi hotline.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-2 text-sm md:items-end md:text-right">
            <p className="font-bold text-lg">1800 6928</p>
            <p>support@medcare.vn</p>
            <p>Khu đô thị sinh viên, TP. Hồ Chí Minh</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

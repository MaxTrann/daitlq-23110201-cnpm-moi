import { useEffect, useState } from "react";
import HeroSlider from "../components/home/HeroSlider";
import QuickServices from "../components/home/QuickServices";
import CategoryShortcut from "../components/home/CategoryShortcut";
import ProductCarousel from "../components/home/ProductCarousel";
import ProductSection from "../components/home/ProductSection";
import LoadingState from "../components/shared/LoadingState";
import { HOME_CAROUSEL_TYPES } from "../constants/homeCarousel";
import { getProductsApi } from "../utils/productApi";
import { parseProductsPageResponse } from "../utils/productPagination";

const HomePage = () => {
  const [sections, setSections] = useState({
    newest: [],
    sale: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      setLoading(true);
      const [newestRes, saleRes] = await Promise.all([
        getProductsApi({ sort: "newest", page: 1, limit: 10 }),
        getProductsApi({ isSale: true, sort: "newest", page: 1, limit: 10 }),
      ]);

      const newest = parseProductsPageResponse(newestRes);
      const sale = parseProductsPageResponse(saleRes);

      setSections({
        newest: newest.items.slice(0, 10),
        sale: sale.items.slice(0, 10),
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

        <ProductCarousel
          title="Bán chạy nhất"
          type={HOME_CAROUSEL_TYPES.BEST_SELLING}
          viewAllTo="/products?sort=best-selling"
        />

        <ProductCarousel
          title="Xem nhiều nhất"
          type={HOME_CAROUSEL_TYPES.MOST_VIEWED}
          viewAllTo="/products?sort=most-viewed"
        />

        {loading ? (
          <LoadingState title="Đang tải sản phẩm..." />
        ) : (
          <>
            <ProductSection title="Sản phẩm mới" products={sections.newest} viewAllTo="/products?sort=newest" />
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

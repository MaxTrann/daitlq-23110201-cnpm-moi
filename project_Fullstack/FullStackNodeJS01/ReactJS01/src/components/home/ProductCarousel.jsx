import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ProductCard from "../product/ProductCard";
import EmptyState from "../shared/EmptyState";
import { HOME_CAROUSEL_PAGE_SIZE } from "../../constants/homeCarousel";
import { getHomeProductCarouselApi } from "../../utils/productApi";
import { parseProductsPageResponse } from "../../utils/productPagination";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductCarousel = ({ title, type, viewAllTo = "/products" }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const loadedPagesRef = useRef(new Set());
  const swiperRef = useRef(null);

  const loadPage = useCallback(
    async (pageNum, { appendSlide = true } = {}) => {
      if (loadedPagesRef.current.has(pageNum)) {
        return;
      }

      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingPage(true);
      }

      try {
        const res = await getHomeProductCarouselApi({
          type,
          page: pageNum,
          limit: HOME_CAROUSEL_PAGE_SIZE,
        });

        if (res?.message) {
          if (pageNum === 1) {
            setSlides([]);
          }
          return;
        }

        const parsed = parseProductsPageResponse(res);
        loadedPagesRef.current.add(pageNum);

        setSlides((prev) => {
          if (!appendSlide) {
            const next = [];
            next[pageNum - 1] = parsed.items;
            return next;
          }
          const next = [...prev];
          next[pageNum - 1] = parsed.items;
          return next;
        });
        setHasMore(parsed.hasMore);
        setTotal(parsed.total);
        setActivePage(pageNum);

        if (pageNum === 1 && parsed.hasMore) {
          loadPage(2);
        }
      } finally {
        setLoading(false);
        setLoadingPage(false);
      }
    },
    [type]
  );

  useEffect(() => {
    loadedPagesRef.current = new Set();
    setSlides([]);
    setHasMore(false);
    setTotal(0);
    setActivePage(1);
    loadPage(1);
  }, [type, loadPage]);

  const handleSlideChange = (swiper) => {
    const pageNum = swiper.activeIndex + 1;
    setActivePage(pageNum);

    if (!loadedPagesRef.current.has(pageNum) && (pageNum === 1 || hasMore || pageNum <= slides.length + 1)) {
      loadPage(pageNum);
    }
  };

  const visibleSlides = slides.filter((page) => Array.isArray(page) && page.length > 0);
  const totalPages = total > 0 ? Math.ceil(total / HOME_CAROUSEL_PAGE_SIZE) : visibleSlides.length;

  useEffect(() => {
    swiperRef.current?.update();
  }, [slides]);

  return (
    <section className="home-product-carousel rounded-lg bg-white p-4 shadow-sm md:p-5">
      <div className="pc-section-title">
        <h2>{title}</h2>
        <Link to={viewAllTo}>Xem tất cả →</Link>
      </div>

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center">
          <Spin tip="Đang tải sản phẩm..." />
        </div>
      ) : visibleSlides.length === 0 ? (
        <EmptyState title="Chưa có sản phẩm" description="Dữ liệu sẽ được cập nhật sớm." />
      ) : (
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: `.carousel-prev-${type}`,
              nextEl: `.carousel-next-${type}`,
            }}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            spaceBetween={16}
            slidesPerView={1}
            className="home-carousel-swiper pb-10"
          >
            {visibleSlides.map((pageProducts, slideIndex) => (
              <SwiperSlide key={`${type}-slide-${slideIndex}`}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {pageProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            className={`carousel-prev-${type} absolute left-0 top-[38%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#0067b8] shadow-md transition hover:bg-[#e8f4fc] disabled:opacity-40`}
            aria-label="Trang trước"
          >
            <LeftOutlined />
          </button>
          <button
            type="button"
            className={`carousel-next-${type} absolute right-0 top-[38%] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#0067b8] shadow-md transition hover:bg-[#e8f4fc] disabled:opacity-40`}
            aria-label="Trang sau"
          >
            <RightOutlined />
          </button>

          {loadingPage && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60">
              <Spin size="small" />
            </div>
          )}

          <p className="mt-1 text-center text-xs text-[#888]">
            Trang {activePage}
            {totalPages > 0 ? ` / ${totalPages}` : ""}
            {total > 0 ? ` · Top ${total} sản phẩm` : ""}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductCarousel;

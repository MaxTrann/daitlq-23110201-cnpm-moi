import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FALLBACK_IMAGE = "https://picsum.photos/seed/fallback-gallery/1000/700";

const ProductImageSlider = ({ images = [] }) => {
  const gallery = images.length > 0 ? images : [FALLBACK_IMAGE];
  const hasMultiple = gallery.length > 1;

  if (!hasMultiple) {
    return (
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <img src={gallery[0]} alt="product" className="h-[420px] w-full object-contain bg-[#fafafa] p-4" />
      </div>
    );
  }

  return (
    <div className="product-gallery-swiper overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={16}
        loop={gallery.length > 1}
      >
        {gallery.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <img
              src={image}
              alt={`product-${index + 1}`}
              className="h-[420px] w-full object-contain bg-[#fafafa] p-4"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImageSlider;

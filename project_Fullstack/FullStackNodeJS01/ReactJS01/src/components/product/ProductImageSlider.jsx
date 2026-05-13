import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductImageSlider = ({ images = [] }) => {
    const gallery = images.length > 0 ? images : ["https://picsum.photos/seed/fallback-gallery/1000/700"];

    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={16}
            >
                {gallery.map((image, index) => (
                    <SwiperSlide key={`${image}-${index}`}>
                        <img src={image} alt={`product-${index + 1}`} className="h-[420px] w-full object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductImageSlider;

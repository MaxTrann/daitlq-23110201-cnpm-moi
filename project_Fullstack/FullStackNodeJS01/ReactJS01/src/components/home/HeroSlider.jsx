import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Ưu đãi thuốc OTC & TPCN",
    desc: "Giảm giá đến 30% — Miễn phí vận chuyển",
    cta: "Mua ngay",
    to: "/products?isSale=true",
    bg: "linear-gradient(135deg, #0067b8 0%, #00a0e9 100%)",
  },
  {
    title: "Tư vấn dược sĩ 24/7",
    desc: "Hỗ trợ chọn thuốc an toàn, đúng liều",
    cta: "Liên hệ ngay",
    to: "tel:18006928",
    bg: "linear-gradient(135deg, #004a85 0%, #0067b8 100%)",
  },
  {
    title: "Thiết bị y tế chính hãng",
    desc: "Máy đo huyết áp, nhiệt kế, máy xông mũi",
    cta: "Khám phá",
    to: "/products?productType=medical_device",
    bg: "linear-gradient(135deg, #00897b 0%, #26a69a 100%)",
  },
];

const HeroSlider = () => (
  <section className="overflow-hidden rounded-lg bg-white shadow-sm">
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="hero-swiper"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.title}>
          <div
            className="flex min-h-[200px] flex-col justify-center px-8 py-10 md:min-h-[280px] md:px-16"
            style={{ background: slide.bg }}
          >
            <p className="m-0 text-sm font-semibold uppercase tracking-wider text-white/80">MedCare</p>
            <h1 className="mt-2 max-w-lg text-2xl font-bold text-white md:text-4xl">{slide.title}</h1>
            <p className="mt-2 max-w-md text-white/90">{slide.desc}</p>
            <Link
              to={slide.to}
              className="mt-6 inline-flex w-fit rounded-md bg-white px-6 py-2.5 text-sm font-bold text-[#0067b8] shadow hover:bg-[#e8f4fc]"
            >
              {slide.cta}
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default HeroSlider;

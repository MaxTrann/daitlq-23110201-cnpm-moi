import Button from "../common/Button";

const PromoBanner = () => {
    return (
        <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_#0284c7,_#0f172a_55%)] text-white shadow-xl shadow-sky-100">
            <div className="grid gap-8 px-6 py-10 md:grid-cols-[1.35fr_0.75fr] md:px-10 md:py-14">
                <div className="space-y-5">
                    <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">
                        Nhà thuốc MedCare
                    </span>
                    <h1 className="max-w-2xl text-3xl font-black leading-tight md:text-5xl">
                        Thuốc OTC, TPCN và thiết bị y tế — mua online an toàn, tư vấn dược sĩ.
                    </h1>
                    <p className="max-w-xl text-sm leading-7 text-slate-200 md:text-base">
                        MedCare cung cấp thông tin thuốc đầy đủ: hoạt chất, hướng dẫn dùng, phân loại kê đơn. Thuốc Rx chỉ tra cứu hoặc liên hệ dược sĩ.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button to="/products?isSale=true" variant="primary" className="px-6">
                            Khám phá ngay
                        </Button>
                        <Button to="/products?sort=best-selling" variant="dark" className="border-white/20 bg-transparent px-6 hover:bg-white/10">
                            Sản phẩm bán chạy
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                    {[
                        { title: "Danh mục theo nhóm bệnh", description: "Tim mạch, tiêu hóa, vitamin, thiết bị y tế — như các chuỗi nhà thuốc lớn." },
                        { title: "OTC mua online", description: "Thuốc không kê đơn và TPCN đặt hàng trực tuyến." },
                        { title: "Thuốc kê đơn", description: "Hiển thị thông tin, hướng dẫn gọi dược sĩ — không bán Rx trực tuyến." }
                    ].map((item) => (
                        <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/20 p-4">
                            <p className="text-lg font-bold text-white">{item.title}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-200">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;

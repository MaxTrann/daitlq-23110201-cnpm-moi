import { useEffect, useState } from 'react';
import PromoBanner from '../components/product/PromoBanner';
import ProductGrid from '../components/product/ProductGrid';
import SectionHeader from '../components/shared/SectionHeader';
import LoadingState from '../components/shared/LoadingState';
import { getProductsApi } from '../util/productApi';

const HomePage = () => {
    const [sections, setSections] = useState({
        newest: [],
        bestSeller: [],
        sale: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeProducts = async () => {
            setLoading(true);
            const [newest, bestSeller, sale] = await Promise.all([
                getProductsApi({ sort: "newest" }),
                getProductsApi({ sort: "best-selling" }),
                getProductsApi({ isSale: true, sort: "newest" })
            ]);

            setSections({
                newest: Array.isArray(newest) ? newest.slice(0, 4) : [],
                bestSeller: Array.isArray(bestSeller) ? bestSeller.slice(0, 4) : [],
                sale: Array.isArray(sale) ? sale.slice(0, 4) : []
            });
            setLoading(false);
        };

        fetchHomeProducts();
    }, []);

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 md:px-6 lg:px-8">
            <PromoBanner />

            {loading ? (
                <LoadingState title="Đang tải sản phẩm nổi bật..." />
            ) : (
                <>
                    <section className="space-y-6">
                        <SectionHeader
                            eyebrow="Mới cập nhật"
                            title="Sản phẩm mới nhất"
                            description="Những sản phẩm vừa được cập nhật lên hệ thống, phù hợp để bạn khám phá nhanh các mẫu mới."
                        />
                        <ProductGrid products={sections.newest} />
                    </section>

                    <section className="space-y-6">
                        <SectionHeader
                            eyebrow="Ưa chuộng"
                            title="Sản phẩm bán chạy"
                            description="Nhóm sản phẩm được nhiều người chọn mua nhất dựa trên số lượng đã bán."
                        />
                        <ProductGrid products={sections.bestSeller} />
                    </section>

                    <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
                        <div className="space-y-6">
                            <SectionHeader
                                eyebrow="Giảm giá"
                                title="Góc khuyến mãi"
                                description="Các sản phẩm đang có ưu đãi để bạn tiết kiệm hơn khi mua sắm."
                            />
                            <ProductGrid products={sections.sale} />
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Liên hệ</p>
                            <h2 className="mt-3 text-2xl font-bold text-slate-900">Cần tư vấn nhanh?</h2>
                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                Campus Shop hỗ trợ lựa chọn sản phẩm phù hợp cho nhu cầu học tập, đi chơi và sử dụng hằng ngày.
                            </p>
                            <div className="mt-6 space-y-3 text-sm text-slate-600">
                                <p>Email: support@campusshop.vn</p>
                                <p>Hotline: 0900 000 999</p>
                                <p>Địa chỉ: Khu đô thị sinh viên, TP. Hồ Chí Minh</p>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}

export default HomePage;

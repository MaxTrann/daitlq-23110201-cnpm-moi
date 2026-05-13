import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductFilter from "../components/product/ProductFilter";
import ProductGrid from "../components/product/ProductGrid";
import ProductSearch from "../components/product/ProductSearch";
import SectionHeader from "../components/shared/SectionHeader";
import LoadingState from "../components/shared/LoadingState";
import { getCategoriesApi, getProductsApi } from "../util/productApi";

const ProductListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const filters = useMemo(() => ({
        keyword: searchParams.get("keyword") || "",
        category: searchParams.get("category") || "",
        priceRange: searchParams.get("priceRange") || "",
        stockStatus: searchParams.get("stockStatus") || "",
        isSale: searchParams.get("isSale") === "true",
        sort: searchParams.get("sort") || "newest"
    }), [searchParams]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoriesApi();
            setCategories(Array.isArray(res) ? res : []);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const params = {
                keyword: filters.keyword || undefined,
                category: filters.category || undefined,
                stockStatus: filters.stockStatus || undefined,
                isSale: filters.isSale ? true : undefined,
                sort: filters.sort || "newest"
            };

            if (filters.priceRange === "under-500k") {
                params.maxPrice = 500000;
            }
            if (filters.priceRange === "500k-1000k") {
                params.minPrice = 500000;
                params.maxPrice = 1000000;
            }
            if (filters.priceRange === "over-1000k") {
                params.minPrice = 1000000;
            }

            const res = await getProductsApi(params);
            setProducts(Array.isArray(res) ? res : []);
            setLoading(false);
        };

        fetchProducts();
    }, [filters]);

    const updateFilters = (nextValues) => {
        const merged = {
            ...filters,
            ...nextValues
        };

        const nextParams = {};
        Object.entries(merged).forEach(([key, value]) => {
            if (key === "isSale") {
                if (value) {
                    nextParams[key] = "true";
                }
                return;
            }

            if (value) {
                nextParams[key] = value;
            }
        });

        setSearchParams(nextParams);
    };

    const handleReset = () => {
        setSearchParams({ sort: "newest" });
    };

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
            <SectionHeader
                eyebrow="Danh mục mua sắm"
                title="Tìm kiếm, lọc và sắp xếp sản phẩm"
                description="Bạn có thể lọc theo danh mục, khoảng giá, tình trạng kho và sắp xếp theo tiêu chí phù hợp."
            />

            <ProductSearch initialValue={filters.keyword} onSearch={(keyword) => updateFilters({ keyword })} />

            <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
                <ProductFilter
                    filters={filters}
                    categories={categories}
                    onChange={updateFilters}
                    onReset={handleReset}
                />

                <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-[1.75rem] border border-slate-200 bg-white px-5 py-4 shadow-sm">
                        <div>
                            <p className="text-lg font-semibold text-slate-900">Danh sách sản phẩm</p>
                            <p className="text-sm text-slate-500">Kết quả được cập nhật trực tiếp từ cơ sở dữ liệu.</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                            {products.length} sản phẩm
                        </span>
                    </div>

                    {loading ? <LoadingState title="Đang tải danh sách sản phẩm..." /> : <ProductGrid products={products} />}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;

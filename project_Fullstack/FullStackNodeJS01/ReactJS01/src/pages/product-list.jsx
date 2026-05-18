import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductFilter from "../components/product/ProductFilter";
import ProductGrid from "../components/product/ProductGrid";
import ProductListLoadMore from "../components/product/ProductListLoadMore";
import ProductSearch from "../components/product/ProductSearch";
import LoadingState from "../components/shared/LoadingState";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";
import { getBrandsApi, getCategoriesApi } from "../utils/productApi";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const filters = useMemo(
    () => ({
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      priceRange: searchParams.get("priceRange") || "",
      stockStatus: searchParams.get("stockStatus") || "",
      isSale: searchParams.get("isSale") === "true",
      sort: searchParams.get("sort") || "newest",
      productType: searchParams.get("productType") || "",
      drugClass: searchParams.get("drugClass") || "",
    }),
    [searchParams]
  );

  const { products, total, hasMore, loading, loadingMore, error, loadMore } = useInfiniteProducts(filters);

  const activeCategory = useMemo(
    () => categories.find((item) => item.slug === filters.category),
    [categories, filters.category]
  );

  useEffect(() => {
    Promise.all([getCategoriesApi(), getBrandsApi()]).then(([catRes, brandRes]) => {
      setCategories(Array.isArray(catRes) ? catRes : []);
      setBrands(Array.isArray(brandRes) ? brandRes : []);
    });
  }, []);

  const updateFilters = (nextValues) => {
    const merged = { ...filters, ...nextValues };
    const nextParams = {};
    Object.entries(merged).forEach(([key, value]) => {
      if (key === "isSale") {
        if (value) nextParams[key] = "true";
        return;
      }
      if (value) nextParams[key] = value;
    });
    setSearchParams(nextParams);
  };

  const handleReset = () => setSearchParams({ sort: "newest" });

  const pageTitle = activeCategory ? activeCategory.name : "Tất cả sản phẩm";
  const pageSubtitle = activeCategory
    ? `Danh mục: ${activeCategory.name}`
    : "Thuốc, TPCN, thiết bị y tế — chính hãng, giao nhanh";

  return (
    <div className="pb-8">
      <div className="border-b border-[#e5e7eb] bg-white py-3">
        <div className="pc-container pc-breadcrumb">
          <Link to="/home">Trang chủ</Link>
          <span> / </span>
          <Link to="/products">Sản phẩm</Link>
          {activeCategory && (
            <>
              <span> / </span>
              <span className="text-[#333]">{activeCategory.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="pc-container py-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="m-0 text-xl font-bold text-[#004a85] md:text-2xl">{pageTitle}</h1>
            <p className="mt-1 text-sm text-[#666]">{pageSubtitle}</p>
          </div>
          <span className="rounded-full bg-[#e8f4fc] px-4 py-1.5 text-sm font-semibold text-[#0067b8]">
            {loading ? "Đang tải..." : `${total || products.length} sản phẩm`}
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <ProductFilter
            filters={filters}
            categories={categories}
            brands={brands}
            onChange={updateFilters}
            onReset={handleReset}
          />

          <div>
            <ProductSearch initialValue={filters.keyword} onSearch={(keyword) => updateFilters({ keyword })} />

            {error && (
              <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {loading ? (
              <LoadingState title="Đang tải danh sách sản phẩm..." />
            ) : (
              <>
                <ProductGrid products={products} />
                <ProductListLoadMore
                  hasMore={hasMore}
                  loading={loading}
                  loadingMore={loadingMore}
                  onLoadMore={loadMore}
                  total={total}
                  loadedCount={products.length}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

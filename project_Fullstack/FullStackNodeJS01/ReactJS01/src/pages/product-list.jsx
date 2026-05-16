import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductFilter from "../components/product/ProductFilter";
import ProductGrid from "../components/product/ProductGrid";
import ProductSearch from "../components/product/ProductSearch";
import LoadingState from "../components/shared/LoadingState";
import { getBrandsApi, getCategoriesApi, getProductsApi } from "../utils/productApi";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

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
    [searchParams],
  );

  useEffect(() => {
    Promise.all([getCategoriesApi(), getBrandsApi()]).then(([catRes, brandRes]) => {
      setCategories(Array.isArray(catRes) ? catRes : []);
      setBrands(Array.isArray(brandRes) ? brandRes : []);
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = {
        keyword: filters.keyword || undefined,
        category: filters.category || undefined,
        brand: filters.brand || undefined,
        stockStatus: filters.stockStatus || undefined,
        isSale: filters.isSale ? true : undefined,
        sort: filters.sort || "newest",
        productType: filters.productType || undefined,
        drugClass: filters.drugClass || undefined,
      };

      if (filters.priceRange === "under-500k") params.maxPrice = 500000;
      if (filters.priceRange === "500k-1000k") {
        params.minPrice = 500000;
        params.maxPrice = 1000000;
      }
      if (filters.priceRange === "over-1000k") params.minPrice = 1000000;

      const res = await getProductsApi(params);
      setProducts(Array.isArray(res) ? res : []);
      setLoading(false);
    };

    fetchProducts();
  }, [filters]);

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

  return (
    <div className="pb-8">
      <div className="border-b border-[#e5e7eb] bg-white py-3">
        <div className="pc-container pc-breadcrumb">
          <Link to="/home">Trang chủ</Link>
          <span> / </span>
          <span>Sản phẩm</span>
        </div>
      </div>

      <div className="pc-container py-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="m-0 text-xl font-bold text-[#004a85] md:text-2xl">Tất cả sản phẩm</h1>
            <p className="mt-1 text-sm text-[#666]">Thuốc, TPCN, thiết bị y tế — chính hãng, giao nhanh</p>
          </div>
          <span className="rounded-full bg-[#e8f4fc] px-4 py-1.5 text-sm font-semibold text-[#0067b8]">
            {products.length} sản phẩm
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

            {loading ? (
              <LoadingState title="Đang tải danh sách sản phẩm..." />
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

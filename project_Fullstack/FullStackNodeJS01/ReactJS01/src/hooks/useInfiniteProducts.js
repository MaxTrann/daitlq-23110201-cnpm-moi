import { useCallback, useEffect, useRef, useState } from "react";
import { getProductsApi } from "../utils/productApi";
import { PRODUCTS_PAGE_SIZE, parseProductsPageResponse } from "../utils/productPagination";

const buildQueryParams = (filters, page) => {
  const params = {
    page,
    limit: PRODUCTS_PAGE_SIZE,
    sort: filters.sort || "newest",
  };

  if (filters.keyword) params.keyword = filters.keyword;
  if (filters.category) params.category = filters.category;
  if (filters.brand) params.brand = filters.brand;
  if (filters.stockStatus) params.stockStatus = filters.stockStatus;
  if (filters.isSale) params.isSale = true;
  if (filters.productType) params.productType = filters.productType;
  if (filters.drugClass) params.drugClass = filters.drugClass;

  if (filters.priceRange === "under-500k") params.maxPrice = 500000;
  if (filters.priceRange === "500k-1000k") {
    params.minPrice = 500000;
    params.maxPrice = 1000000;
  }
  if (filters.priceRange === "over-1000k") params.minPrice = 1000000;

  return params;
};

export const useInfiniteProducts = (filters) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const filtersKey = JSON.stringify(filters);
  const requestIdRef = useRef(0);

  const fetchPage = useCallback(
    async (pageToLoad, append) => {
      const requestId = ++requestIdRef.current;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const res = await getProductsApi(buildQueryParams(filters, pageToLoad));

        if (requestId !== requestIdRef.current) {
          return;
        }

        if (res?.message) {
          setError(res.message);
          if (!append) {
            setProducts([]);
            setTotal(0);
            setHasMore(false);
          }
          return;
        }

        const parsed = parseProductsPageResponse(res);

        setProducts((prev) => (append ? [...prev, ...parsed.items] : parsed.items));
        setPage(parsed.page);
        setTotal(parsed.total);
        setHasMore(parsed.hasMore);
      } catch {
        if (requestId === requestIdRef.current) {
          setError("Không thể tải danh sách sản phẩm");
          if (!append) {
            setProducts([]);
            setTotal(0);
            setHasMore(false);
          }
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [filtersKey]
  );

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(false);
    fetchPage(1, false);
  }, [filtersKey, fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) {
      return;
    }
    fetchPage(page + 1, true);
  }, [fetchPage, hasMore, loading, loadingMore, page]);

  return {
    products,
    total,
    hasMore,
    loading,
    loadingMore,
    error,
    loadMore,
    refresh: () => fetchPage(1, false),
  };
};

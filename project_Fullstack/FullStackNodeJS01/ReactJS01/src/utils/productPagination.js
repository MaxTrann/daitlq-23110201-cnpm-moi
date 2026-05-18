export const PRODUCTS_PAGE_SIZE = 12;

/** Chuẩn hóa response API: mảng (cũ) hoặc object phân trang (mới) */
export const parseProductsPageResponse = (res) => {
  if (Array.isArray(res)) {
    return {
      items: res,
      page: 1,
      limit: res.length,
      total: res.length,
      totalPages: 1,
      hasMore: false,
    };
  }

  return {
    items: Array.isArray(res?.items) ? res.items : [],
    page: res?.page ?? 1,
    limit: res?.limit ?? PRODUCTS_PAGE_SIZE,
    total: res?.total ?? 0,
    totalPages: res?.totalPages ?? 0,
    hasMore: Boolean(res?.hasMore),
  };
};

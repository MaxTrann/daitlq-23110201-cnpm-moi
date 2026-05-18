import { useEffect, useRef } from "react";
import { Spin } from "antd";

const ProductListLoadMore = ({ hasMore, loading, loadingMore, onLoadMore, total, loadedCount }) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) {
      return undefined;
    }

    const node = sentinelRef.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, onLoadMore]);

  if (loading) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      {hasMore && (
        <div ref={sentinelRef} className="flex min-h-[48px] items-center justify-center">
          {loadingMore && <Spin tip="Đang tải thêm sản phẩm..." />}
        </div>
      )}

      <p className="text-center text-sm text-[#888]">
        {loadedCount > 0
          ? `Đã hiển thị ${loadedCount}${total ? ` / ${total}` : ""} sản phẩm`
          : "Không có sản phẩm"}
        {!hasMore && loadedCount > 0 && " — hết danh sách"}
      </p>
    </div>
  );
};

export default ProductListLoadMore;

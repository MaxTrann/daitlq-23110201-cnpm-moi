import { useEffect, useState } from "react";

const ProductSearch = ({ initialValue = "", onSearch }) => {
  const [keyword, setKeyword] = useState(initialValue);

  useEffect(() => {
    setKeyword(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-col gap-2 rounded-lg border border-[#e5e7eb] bg-white p-3 shadow-sm sm:flex-row sm:items-center"
    >
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Tìm theo tên, SKU, mô tả..."
        className="min-w-0 flex-1 rounded-md border border-[#e5e7eb] px-4 py-2.5 text-sm outline-none focus:border-[#0067b8]"
      />
      <div className="flex shrink-0 gap-2">
        <button type="submit" className="pc-btn-primary px-5 py-2.5 text-sm">
          Tìm kiếm
        </button>
        <button
          type="button"
          className="rounded-md border border-[#ddd] px-4 py-2.5 text-sm font-medium text-[#666] hover:border-[#0067b8] hover:text-[#0067b8]"
          onClick={() => {
            setKeyword("");
            onSearch("");
          }}
        >
          Xóa
        </button>
      </div>
    </form>
  );
};

export default ProductSearch;

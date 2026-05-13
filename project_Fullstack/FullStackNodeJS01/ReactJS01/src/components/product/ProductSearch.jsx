import { useEffect, useState } from "react";
import Button from "../common/Button";

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
            <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm sản phẩm theo tên..."
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
            />
            <div className="flex gap-3">
                <Button type="submit" variant="primary" className="rounded-2xl px-5 py-3">
                    Tìm kiếm
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    className="rounded-2xl px-5 py-3"
                    onClick={() => {
                        setKeyword("");
                        onSearch("");
                    }}
                >
                    Xóa
                </Button>
            </div>
        </form>
    );
};

export default ProductSearch;

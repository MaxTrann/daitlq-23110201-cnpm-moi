import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoriesApi } from "../../utils/productApi";

const CategoryShortcut = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategoriesApi().then((res) => setCategories(Array.isArray(res) ? res.slice(0, 8) : []));
  }, []);

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm md:p-6">
      <div className="pc-section-title">
        <h2>Danh mục tủ thuốc</h2>
        <Link to="/products">Xem tất cả</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/products?category=${cat.slug}`}
            className="flex flex-col items-center rounded-lg border border-[#eee] p-3 text-center transition hover:border-[#0067b8] hover:bg-[#e8f4fc]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4fc] text-xl text-[#0067b8]">
              💊
            </span>
            <span className="mt-2 line-clamp-2 text-xs font-medium text-[#333]">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryShortcut;

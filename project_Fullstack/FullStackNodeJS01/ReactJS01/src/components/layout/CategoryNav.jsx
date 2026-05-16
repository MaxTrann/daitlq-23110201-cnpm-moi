import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoriesApi } from "../../utils/productApi";

const categoryIcons = {
  "tim-mach": "❤️",
  "tieu-hoa": "🫁",
  "vitamin-khoang-chat": "💊",
  tpcn: "🌿",
  "thiet-bi-y-te": "🩺",
  "me-va-be": "👶",
  "da-toc-mong": "✨",
};

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategoriesApi().then((res) => {
      setCategories(Array.isArray(res) ? res : []);
    });
  }, []);

  return (
    <nav className="border-b border-[#d0e8f7] bg-[#e8f4fc]">
      <div className="pc-container">
        <ul className="flex list-none gap-1 overflow-x-auto py-2 m-0 p-0 scrollbar-thin">
          <li className="shrink-0">
            <Link
              to="/products"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-[#0067b8] hover:bg-white"
            >
              Tất cả
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat._id} className="shrink-0">
              <Link
                to={`/products?category=${cat.slug}`}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-sm text-[#333] hover:bg-white hover:text-[#0067b8]"
              >
                <span>{categoryIcons[cat.slug] || "💉"}</span>
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryNav;

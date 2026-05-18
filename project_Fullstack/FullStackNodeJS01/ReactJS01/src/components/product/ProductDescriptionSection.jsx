import { useEffect, useMemo, useRef, useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { isHtmlContent, sanitizeHtml } from "../../utils/sanitizeHtml";

const COLLAPSED_HEIGHT = 320;

const formatBlock = (title, content) => {
  if (!content?.trim()) return null;
  const isHtml = isHtmlContent(content);
  return (
    <div className="space-y-2">
      {title && <h3 className="text-base font-bold text-[#333]">{title}</h3>}
      {isHtml ? (
        <div className="pc-product-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
      ) : (
        <p className="whitespace-pre-line text-sm leading-7 text-[#555]">{content}</p>
      )}
    </div>
  );
};

const ProductDescriptionSection = ({ product }) => {
  const md = product?.medicineDetail;
  const contentRef = useRef(null);
  const [activeKey, setActiveKey] = useState("description");
  const [expanded, setExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);

  const tabs = useMemo(() => {
    const items = [];

    if (product?.description?.trim()) {
      items.push({ key: "description", label: "Mô tả", content: product.description });
    }
    if (md?.activeIngredient?.trim()) {
      items.push({ key: "ingredient", label: "Thành phần", content: md.activeIngredient });
    }
    if (md?.indications?.trim()) {
      items.push({ key: "indications", label: "Chỉ định", content: md.indications });
    }
    if (md?.usage?.trim()) {
      items.push({ key: "usage", label: "Cách sử dụng", content: md.usage });
    }
    if (md?.warnings?.trim()) {
      items.push({ key: "warnings", label: "Thận trọng", content: md.warnings });
    }

    const manufacturing = [
      product?.brand?.name && `Nhà sản xuất: ${product.brand.name}`,
      product?.category?.name && `Danh mục: ${product.category.name}`,
      md?.registrationNo && `Số đăng ký: ${md.registrationNo}`,
      md?.storage && `Bảo quản: ${md.storage}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (manufacturing) {
      items.push({ key: "manufacturing", label: "Thông tin sản xuất", content: manufacturing });
    }

    return items;
  }, [product, md]);

  const activeTab = tabs.find((tab) => tab.key === activeKey) || tabs[0];

  useEffect(() => {
    if (tabs.length && !tabs.some((tab) => tab.key === activeKey)) {
      setActiveKey(tabs[0].key);
    }
  }, [tabs, activeKey]);

  useEffect(() => {
    setExpanded(false);
  }, [activeKey, product?._id]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      setNeedsExpand(node.scrollHeight > COLLAPSED_HEIGHT + 8);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [activeTab?.content, activeKey]);

  if (!tabs.length) {
    return null;
  }

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-5 text-xl font-bold text-[#004a85]">Mô tả sản phẩm</h2>

      {tabs.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-1 border-b border-[#e5e7eb]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveKey(tab.key)}
              className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                activeKey === tab.key
                  ? "border-[#0067b8] text-[#0067b8]"
                  : "border-transparent text-[#666] hover:text-[#0067b8]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <div
          ref={contentRef}
          className={`overflow-hidden transition-[max-height] duration-300 ${
            expanded ? "max-h-none" : "max-h-[320px]"
          }`}
        >
          {formatBlock(null, activeTab?.content)}
        </div>

        {!expanded && needsExpand && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/95 to-transparent"
            aria-hidden
          />
        )}
      </div>

      {needsExpand && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0067b8] hover:text-[#004a85]"
          >
            {expanded ? (
              <>
                Thu gọn <UpOutlined className="text-xs" />
              </>
            ) : (
              <>
                Xem thêm <DownOutlined className="text-xs" />
              </>
            )}
          </button>
        </div>
      )}

    </section>
  );
};

export default ProductDescriptionSection;

/** Loại bỏ script/iframe trước khi render HTML từ admin */
export const sanitizeHtml = (html = "") => {
  if (!html || typeof html !== "string") return "";

  if (typeof DOMParser === "undefined") {
    return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script, iframe, object, embed, form").forEach((node) => node.remove());
  return doc.body.innerHTML;
};

export const isHtmlContent = (text = "") => /<[a-z][\s\S]*>/i.test(text);

export const htmlToPlainText = (html = "") => {
  if (!html) return "";
  if (!isHtmlContent(html)) return html;
  if (typeof DOMParser === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").trim();
};

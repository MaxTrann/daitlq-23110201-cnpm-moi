import { useEffect, useId, useRef, useState } from "react";
import { Spin } from "antd";

const TINYMCE_CDN = "https://cdn.jsdelivr.net/npm/tinymce@7.6.1";
let tinymceLoader;

const loadTinyMce = () => {
  if (window.tinymce) {
    return Promise.resolve(window.tinymce);
  }
  if (tinymceLoader) {
    return tinymceLoader;
  }

  tinymceLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${TINYMCE_CDN}/tinymce.min.js`;
    script.referrerPolicy = "origin";
    script.onload = () => resolve(window.tinymce);
    script.onerror = () => reject(new Error("Không tải được trình soạn thảo"));
    document.head.appendChild(script);
  });

  return tinymceLoader;
};

const RichTextEditor = ({ value = "", onChange, disabled = false, height = 420 }) => {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const editorId = useId().replace(/:/g, "");
  const [loading, setLoading] = useState(true);

  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const tinymce = await loadTinyMce();
        if (cancelled || !textareaRef.current) return;

        await tinymce.init({
          target: textareaRef.current,
          license_key: "gpl",
          height,
          menubar: "edit view insert format tools table help",
          language: "vi",
          language_url: `${TINYMCE_CDN}/langs/vi.js`,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table | removeformat | code fullscreen | help",
          branding: false,
          promotion: false,
          resize: true,
          statusbar: true,
          content_style:
            'body { font-family: "Be Vietnam Pro", system-ui, sans-serif; font-size: 14px; line-height: 1.6; color: #333; }',
          setup: (editor) => {
            editorRef.current = editor;
            editor.on("change keyup undo redo", () => {
              onChangeRef.current?.(editor.getContent());
            });
          },
          init_instance_callback: (editor) => {
            editor.setContent(value || "");
            if (disabled) {
              editor.mode.set("readonly");
            }
            setLoading(false);
          },
        });
      } catch {
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (editorRef.current) {
        const id = editorRef.current.id;
        editorRef.current = null;
        window.tinymce?.remove(id);
      }
    };
  }, [editorId, height]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const current = editor.getContent();
    const next = value || "";
    if (current !== next) {
      editor.setContent(next);
    }
  }, [value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.mode.set(disabled ? "readonly" : "design");
  }, [disabled]);

  return (
    <div className="rich-text-editor-wrap relative min-h-[200px] rounded-lg border border-slate-200 bg-white">
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <Spin tip="Đang tải trình soạn thảo..." />
        </div>
      )}
      <textarea
        id={editorId}
        ref={textareaRef}
        defaultValue={value}
        disabled={disabled}
        className="min-h-[200px] w-full resize-y border-0 p-3 text-sm outline-none"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default RichTextEditor;

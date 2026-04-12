"use client";

import "react-quill-new/dist/quill.snow.css";
import "@/styles/quill-override.css";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

// FIX: Do NOT use next/dynamic for components that need a ref.
// next/dynamic strips ref from the component type.
// Instead, lazy-load manually with useEffect (client-side only) so SSR is handled
// without losing TypeScript's ref inference.
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  onImageUpload,
}: RichTextEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const quillRef = useRef<any>(null);

  // Lazy-load react-quill-new on the client only (replaces next/dynamic)
  useEffect(() => {
    import("react-quill-new").then((mod) => {
      setReactQuill(() => mod.default);
    });
  }, []);

  // Stable mutable refs so imageHandler never changes identity
  const onImageUploadRef = useRef(onImageUpload);
  onImageUploadRef.current = onImageUpload;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const imageHandler = useCallback(async () => {
    if (!onImageUploadRef.current) return;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;

      const range = editor.getSelection(true);
      const imageUrl = await onImageUploadRef.current!(file);
      const insertIndex = range?.index ?? editor.getLength();

      editor.insertEmbed(insertIndex, "image", imageUrl, "user");
      editor.setSelection(insertIndex + 1, 0);
      onChangeRef.current(editor.root.innerHTML);
    };
  }, []); // stable — reads from refs internally

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          [{ header: [1, 2, 3, false] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler],
  );

  if (!ReactQuill) {
    return <p className="text-sm text-slate-400 p-4">Loading editor...</p>;
  }

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={modules}
    />
  );
}

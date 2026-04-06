"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/quill-override.css";
import React, { useMemo, useRef } from "react";

const ReactQuillDynamic = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  onImageUpload,
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

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
          image: async () => {
            if (!onImageUpload) return;

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
              const imageUrl = await onImageUpload(file);
              const insertIndex = range?.index ?? editor.getLength();

              editor.insertEmbed(insertIndex, "image", imageUrl, "user");
              editor.setSelection(insertIndex + 1, 0);
              onChange(editor.root.innerHTML);
            };
          },
        },
      },
    }),
    [onChange, onImageUpload]
  );

  return (
    <ReactQuillDynamic
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={modules}
    />
  );
}

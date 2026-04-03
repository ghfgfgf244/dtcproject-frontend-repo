"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/quill-override.css";
import React from "react";

// Dynamically import ReactQuill to prevent "document is not defined" error during SSR
const ReactQuillDynamic = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <ReactQuillDynamic
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={{
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ header: [1, 2, 3, false] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "clean"],
        ],
      }}
    />
  );
}

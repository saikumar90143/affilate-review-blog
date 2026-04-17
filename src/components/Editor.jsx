"use client";

import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function Editor({ value, onChange }) {
  const quillRef = useRef(null);

  // Custom image handler: fetches a Cloudinary signature then uploads directly
  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      // Insert a loading placeholder at current cursor
      const range = editor.getSelection(true);

      try {
        // 1. Get secure signature from our backend
        const sigRes = await fetch("/api/upload");
        if (!sigRes.ok) throw new Error("Failed to get upload signature");
        const { timestamp, signature, api_key, cloud_name } = await sigRes.json();

        // 2. Upload directly to Cloudinary (no server payload limits)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", api_key);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", "affiliate-blog");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadRes.ok) throw new Error("Cloudinary upload failed");

        const data = await uploadRes.json();

        // 3. Insert the Cloudinary URL into the editor (not base64!)
        editor.insertEmbed(range.index, "image", data.secure_url);
        editor.setSelection(range.index + 1);
      } catch (err) {
        console.error("Editor image upload failed:", err);
        alert("Image upload failed. Please try again.");
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "link",
    "image",
  ];

  return (
    <div className="bg-white text-black rounded-lg overflow-hidden border border-gray-300">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-64 mb-12"
      />
    </div>
  );
}

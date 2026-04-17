"use client";

import { useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function Editor({ value, onChange }) {
  const quillRef = useRef(null);

  // Securely upload a file to Cloudinary and return the URL
  const uploadToCloudinary = async (file) => {
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
    return data.secure_url;
  };

  // Custom image handler for toolbar button
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

      const range = editor.getSelection(true);

      try {
        const url = await uploadToCloudinary(file);
        editor.insertEmbed(range.index, "image", url);
        editor.setSelection(range.index + 1);
      } catch (err) {
        console.error("Editor image upload failed:", err);
        alert("Image upload failed. Please try again.");
      }
    };
  };

  // Intercept pastes to prevent base64 images
  useEffect(() => {
    // Small delay to ensure quill is initialized
    setTimeout(() => {
      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      const handlePaste = async (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const items = clipboardData.items;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              e.preventDefault(); // Stop default base64 paste
              const range = editor.getSelection(true);
              try {
                const url = await uploadToCloudinary(file);
                editor.insertEmbed(range.index, "image", url);
                editor.setSelection(range.index + 1);
              } catch (err) {
                console.error("Pasted image upload failed:", err);
              }
            }
          }
        }
      };

      editor.root.addEventListener("paste", handlePaste, true);
    }, 500);
  }, []);

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
    "header", "bold", "italic", "underline", "strike", "blockquote", "list", "link", "image",
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

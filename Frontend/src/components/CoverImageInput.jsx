import { useState } from "react";
import api from "../api/api";

import { imageUrl } from "../utils/imageUrl";

export default function CoverImageInput({ value, onChange, onUploading }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const upload = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Choose a PNG, JPEG, or WebP image up to 5 MB.");
      return;
    }
    setError("");
    setUploading(true);
    onUploading(true);
    try {
      const body = new FormData();
      body.append("cover", file);
      const { data } = await api.post("/blogs/cover", body);
      onChange(data.coverImage);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
      onUploading(false);
    }
  };
  return (
    <div>
      <label htmlFor="blog-cover" className="block mb-2 font-semibold text-zinc-700">Cover image (optional)</label>
      {value && <img src={imageUrl(value)} alt="Selected cover preview" className="w-full max-h-72 object-cover rounded-xl mb-3" />}
      <input id="blog-cover" type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={upload} aria-describedby="cover-help" className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 file:px-4 file:py-2" />
      <p id="cover-help" className="text-sm text-zinc-500 mt-2">PNG, JPEG, or WebP. Maximum 5 MB. Wide images work best.</p>
      {uploading && <p role="status" className="text-indigo-600 mt-2">Uploading cover...</p>}
      {error && <p role="alert" className="text-red-600 mt-2">{error}</p>}
      {value && <button type="button" disabled={uploading} onClick={() => onChange("")} className="text-rose-600 text-sm mt-2 hover:underline">Remove cover</button>}
    </div>
  );
}

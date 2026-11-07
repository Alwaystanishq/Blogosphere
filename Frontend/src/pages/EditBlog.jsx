import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import BlogEditor from "../components/BlogEditor";

export default function EditBlog() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    api.get(`/blogs/${id}`).then(({ data }) => {
      if (active) setResult({ id, blog: data.blog });
    }).catch((err) => {
      if (active) setResult({ id, error: err.response?.data?.message || "Failed to load blog" });
    });
    return () => { active = false; };
  }, [id]);
  if (!result || result.id !== id) return <p className="text-center pt-24">Loading blog...</p>;
  if (result.error) return <p role="alert" className="text-center text-red-500 pt-24">{result.error}</p>;
  return <BlogEditor key={id} id={id} initialBlog={result.blog} />;
}

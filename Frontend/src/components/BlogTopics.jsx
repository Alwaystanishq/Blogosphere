import { Link } from "react-router-dom";

export default function BlogTopics({ category, tags = [] }) {
  if (!category && tags.length === 0) return null;
  const topicLink = (name, value) => `/latest?${new URLSearchParams({ [name]: value })}`;
  return (
    <div className="flex flex-wrap gap-2 my-4" aria-label="Post topics" onClick={(event) => event.stopPropagation()}>
      {category && <Link to={topicLink("category", category)} aria-label={`Browse category: ${category}`} className="bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full px-3 py-1 hover:bg-indigo-200">{category}</Link>}
      {tags.map((tag) => <Link key={tag} to={topicLink("tag", tag)} aria-label={`Browse tag: ${tag}`} className="bg-zinc-100 text-zinc-700 text-sm rounded-full px-3 py-1 hover:bg-zinc-200">#{tag}</Link>)}
    </div>
  );
}

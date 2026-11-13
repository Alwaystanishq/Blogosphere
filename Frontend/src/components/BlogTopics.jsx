import { Link } from "react-router-dom";

export default function BlogTopics({ category, tags = [] }) {
  if (!category && tags.length === 0) return null;
  const topicLink = (name, value) => `/latest?${new URLSearchParams({ [name]: value })}`;
  return (
    <div className="topic-links" aria-label="Post topics" onClick={(event) => event.stopPropagation()}>
      {category && <Link to={topicLink("category", category)} aria-label={`Browse category: ${category}`} className="topic-category">{category}</Link>}
      {tags.map((tag) => <Link key={tag} to={topicLink("tag", tag)} aria-label={`Browse tag: ${tag}`} className="topic-tag">#{tag}</Link>)}
    </div>
  );
}

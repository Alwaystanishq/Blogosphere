import { imageUrl } from "../utils/imageUrl";
import BlogTopics from "./BlogTopics";
import { HiOutlineHeart, HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function BlogCard({ blog, showActions = false, onEdit, onDelete, deleting = false }) {
  const draft = blog.status === "draft";
  const destination = draft ? `/edit/${blog._id}` : `/blog/${blog._id}`;
  const author = blog.writtenBy?.username;
  const minutes = Math.max(1, Math.ceil((blog.article || "").split(/\s+/).filter(Boolean).length / 200));
  return <article className="story-card">
    <div>
      {blog.coverImage && <Link to={destination} tabIndex={-1} aria-hidden="true" className="story-cover"><img src={imageUrl(blog.coverImage)} alt="" width="720" height="420" loading="lazy" /></Link>}
      <div className="story-body">
        <div className="story-meta"><span className={draft ? "draft-label" : ""}>{draft ? "Private draft" : "Published story"}</span><span>{minutes} min read</span></div>
        <h2><Link to={destination}>{blog.title || "Untitled draft"}</Link></h2>
        <p className="story-excerpt">{blog.article || "Your next story starts here. Open this draft to keep writing."}</p>
        <BlogTopics category={blog.category} tags={blog.tags} />
        <div className="story-bottom">
          {author ? <Link className="story-author" to={`/profile/${author}`}><span className="author-initial" aria-hidden="true">{author.charAt(0).toUpperCase()}</span><span>@{author}</span></Link> : <span className="story-author">Blogosphere writer</span>}
          <span className="story-likes" aria-label={`${blog.likedBy?.length || 0} likes`}><HiOutlineHeart />{blog.likedBy?.length || 0}</span>
          <Link to={destination} className="story-read" aria-label={`${draft ? "Continue writing" : "Read"}: ${blog.title || "Untitled draft"}`}><HiArrowRight /></Link>
        </div>
        {showActions && <div className="story-actions"><button onClick={onEdit}>Edit story</button><button className="delete-action" disabled={deleting} onClick={onDelete}>{deleting ? "Deleting…" : "Delete"}</button></div>}
      </div>
    </div>
  </article>;
}

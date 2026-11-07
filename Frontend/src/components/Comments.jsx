import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function CommentForm({ onSubmit, label, onCancel, disabled = false }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim() || busy || disabled) return;
    setBusy(true);
    setError("");
    try {
      await onSubmit(text.trim());
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not post. Your text is still here.");
    } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="my-4 space-y-2">
      <label className="block text-sm font-medium text-zinc-700">{label}
        <textarea value={text} disabled={busy || disabled} onChange={(event) => setText(event.target.value)} maxLength={2000} rows={3} required className="block w-full mt-2 border border-zinc-300 rounded-xl p-3" />
      </label>
      <p className="text-xs text-zinc-500">{text.length}/2000 characters</p>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <button disabled={busy || disabled || !text.trim()} className="rounded-lg bg-indigo-600 text-white px-4 py-2 disabled:opacity-50">{busy ? "Posting..." : label}</button>
      {onCancel && <button type="button" disabled={busy || disabled} onClick={onCancel} className="ml-3 text-zinc-600">Cancel</button>}
    </form>
  );
}

export default function Comments({ blogId, blogAuthorId }) {
  const { user } = useAuth();
  const userId = String(user?._id || user?.id || "");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    api.get(`/blogs/${blogId}/comments`, { params: { page: 1 }, signal: controller.signal }).then(({ data }) => {
      setComments(data.comments);
      setHasMore(data.hasMore);
      setLoading(false);
    }).catch((err) => {
      if (!controller.signal.aborted) { setError(err.response?.data?.message || "Failed to load comments"); setLoading(false); }
    });
    return () => controller.abort();
  }, [blogId]);
  const loadMore = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/blogs/${blogId}/comments`, { params: { page: page + 1 } });
      setComments((current) => [...current, ...data.comments.filter((item) => !current.some((existing) => existing._id === item._id))]);
      setPage(page + 1);
      setHasMore(data.hasMore);
    } catch (err) { setError(err.response?.data?.message || "Failed to load more comments"); }
    finally { setLoading(false); }
  };
  const post = async (text, parent = null) => {
    const { data } = await api.post(`/blogs/${blogId}/comments`, { text, parent });
    if (parent) {
      setComments((current) => current.map((comment) => comment._id === parent ? { ...comment, replies: [...comment.replies, data.comment] } : comment));
      setReplyTo(null);
    } else setComments((current) => [{ ...data.comment, replies: [] }, ...current]);
  };
  const remove = async (id) => {
    if (!window.confirm("Remove this comment? Existing replies will remain.")) return;
    setDeleting(id);
    setError("");
    try {
      await api.delete(`/blogs/${blogId}/comments/${id}`);
      const mark = (comment) => comment._id === id ? { ...comment, deleted: true, text: "" } : comment;
      setComments((current) => current.map((comment) => ({ ...mark(comment), replies: comment.replies.map(mark) })));
      if (replyTo === id) setReplyTo(null);
    } catch (err) { setError(err.response?.data?.message || "Failed to remove comment"); }
    finally { setDeleting(null); }
  };
  const content = (comment, isReply = false) => (
    <div key={comment._id} className={isReply ? "border-l-2 border-indigo-100 pl-4 mt-4" : "border border-zinc-200 rounded-xl p-4 mt-4"}>
      <div className="flex flex-wrap gap-3 items-center text-sm">
        {comment.author?.username ? <Link className="font-semibold text-indigo-600" to={`/profile/${comment.author.username}`}>@{comment.author.username}</Link> : <span>Former user</span>}
        <time className="text-zinc-500" dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleString()}</time>
      </div>
      <p className="whitespace-pre-wrap break-words text-zinc-700 mt-2">{comment.deleted ? "This comment was removed." : comment.text}</p>
      {!comment.deleted && <div className="flex gap-4 mt-2 text-sm">
        {!isReply && <button onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)} className="text-indigo-600">Reply</button>}
        {(userId === String(comment.author?._id) || userId === String(blogAuthorId)) && <button disabled={deleting !== null} onClick={() => remove(comment._id)} className="text-rose-600">{deleting === comment._id ? "Removing..." : "Remove"}</button>}
      </div>}
      {!isReply && replyTo === comment._id && <CommentForm label="Post reply" onSubmit={(text) => post(text, comment._id)} onCancel={() => setReplyTo(null)} />}
      {!isReply && comment.replies.map((reply) => content(reply, true))}
    </div>
  );
  return <section className="mt-10 border-t border-zinc-200 pt-8" aria-label="Comments and replies">
    <h2 className="text-2xl font-bold text-zinc-800">Discussion</h2>
    <p className="text-sm text-zinc-500 mt-2">Join the conversation. You can remove your comments; the post author can moderate the discussion.</p>
    <CommentForm disabled={loading} label="Post comment" onSubmit={(text) => post(text)} />
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {comments.map((comment) => content(comment))}
    {loading && <p role="status" className="text-zinc-500 mt-4">Loading comments...</p>}
    {!loading && !error && comments.length === 0 && <p className="text-zinc-500">Be the first to comment.</p>}
    {hasMore && <button disabled={loading} onClick={loadMore} className="mt-4 text-indigo-600 font-medium">Load more comments</button>}
  </section>;
}

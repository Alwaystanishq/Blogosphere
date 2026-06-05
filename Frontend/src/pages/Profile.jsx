import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import BlogCard from "../components/BlogCard";

function Profile() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/blogs/profile/${username}`);

        if (res.data.success) {
          setUser(res.data.user);
          setBlogs(res.data.blogs || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="text-center pt-24 text-indigo-600 font-medium">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 pt-24">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center pt-24">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
      {/* Profile Header */}
      <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-8 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={`http://localhost:5000${user.profilePic}`}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100"
          />

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-indigo-600">
              @{user.username}
            </h1>

            <p className="text-zinc-500 mt-2">
              {blogs.length} {blogs.length === 1 ? "Blog" : "Blogs"} Published
            </p>
          </div>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-indigo-600">
          Blogs
        </h2>

        <p className="text-zinc-500 mt-1">
          Articles written by @{user.username}
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-zinc-500">
            This user hasn't written any blogs yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
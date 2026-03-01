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
          setBlogs(res.data.blogs);
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
    return <div className="text-center pt-24">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 pt-24">{error}</div>;
  }

  if (!user) {
    return <div className="text-center pt-24">User not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-10">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <img
          src={`http://localhost:5000${user.profilePic}`}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">@{user.username}</h1>

          <p className="text-gray-600 mt-2">
            {blogs.length} {blogs.length === 1 ? "Blog" : "Blogs"}
          </p>
        </div>
      </div>

      {/* Blogs Section */}
      <h2 className="text-2xl font-semibold mb-6">Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500">This user hasn’t written any blogs yet.</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;

import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center pt-24 text-indigo-600 font-medium">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/latest" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side */}
          <div>
            <span className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">
              ✍️ Write • Read • Connect
            </span>

            <h1 className="text-5xl md:text-7xl font-bold mt-6 leading-tight">
              Share Your
              <span className="block text-indigo-600">
                Stories With The World
              </span>
            </h1>

            <p className="text-zinc-600 text-lg mt-6 leading-8 max-w-xl">
              Blogosphere is a place where writers and readers connect.
              Publish articles, discover ideas, and build your personal brand.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/signup"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition shadow-lg"
              >
                Start Writing
              </Link>

              <Link
                to="/login"
                className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="grid gap-5">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-zinc-100">
              <h3 className="text-xl font-bold text-indigo-600 mb-2">
                📝 Publish Blogs
              </h3>
              <p className="text-zinc-600">
                Write articles and share your thoughts with thousands of readers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg border border-zinc-100">
              <h3 className="text-xl font-bold text-rose-500 mb-2">
                ❤️ Engage With Content
              </h3>
              <p className="text-zinc-600">
                Discover blogs, like your favorites, and explore new ideas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg border border-zinc-100">
              <h3 className="text-xl font-bold text-emerald-600 mb-2">
                👤 Build Your Profile
              </h3>
              <p className="text-zinc-600">
                Create a unique identity and showcase your published work.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
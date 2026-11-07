import { Link, Navigate } from "react-router-dom";
import useReveal from "../hooks/useReveal";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, loading } = useAuth();

  const scope = useReveal(!loading && !user);

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
    <div ref={scope} className="editorial-home min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side */}
          <div>
            <span data-intro className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">
              A HOME FOR CURIOUS MINDS
            </span>

            <h1 data-intro className="text-5xl md:text-7xl font-bold mt-6 leading-tight">
              Ideas worth
              <span className="block text-indigo-600">
                putting into words.
              </span>
            </h1>

            <p data-intro className="text-zinc-600 text-lg mt-6 leading-8 max-w-xl">
              Blogosphere is a place where writers and readers connect.
              Publish articles, discover ideas, and build your personal brand.
            </p>

            <div data-intro className="flex flex-wrap gap-4 mt-10">
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
            <div data-reveal className="home-feature bg-white p-6 rounded-3xl border border-zinc-100">
              <h3 className="text-xl font-bold text-indigo-600 mb-2">
                01 / Share your perspective
              </h3>
              <p className="text-zinc-600">
                Write articles and share your thoughts with thousands of readers.
              </p>
            </div>

            <div data-reveal className="home-feature bg-white p-6 rounded-3xl border border-zinc-100">
              <h3 className="text-xl font-bold text-rose-500 mb-2">
                02 / Follow your curiosity
              </h3>
              <p className="text-zinc-600">
                Discover blogs, like your favorites, and explore new ideas.
              </p>
            </div>

            <div data-reveal className="home-feature bg-white p-6 rounded-3xl border border-zinc-100">
              <h3 className="text-xl font-bold text-emerald-600 mb-2">
                03 / Find your people
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
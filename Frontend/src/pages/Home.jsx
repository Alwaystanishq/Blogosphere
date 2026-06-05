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
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6">
        Welcome to{" "}
        <span className="text-indigo-600">
          Blogosphere
        </span>
      </h1>

      <p className="text-zinc-600 max-w-2xl mb-10 text-lg md:text-xl leading-8">
        Share your thoughts, discover inspiring stories, and connect with
        passionate writers from around the world.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/signup"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition shadow-md"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          Login
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-zinc-200">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">
            Write
          </h3>

          <p className="text-zinc-600">
            Create beautiful blogs and share your ideas with the world.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-zinc-200">
          <h3 className="text-xl font-semibold text-rose-500 mb-3">
            Engage
          </h3>

          <p className="text-zinc-600">
            Like and discover articles written by other creators.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-zinc-200">
          <h3 className="text-xl font-semibold text-emerald-600 mb-3">
            Grow
          </h3>

          <p className="text-zinc-600">
            Build your profile and become part of the Blogosphere community.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
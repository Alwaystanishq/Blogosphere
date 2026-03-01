import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center pt-24">Loading...</div>;
  }

  // If logged in → go to latest
  if (user) {
    return <Navigate to="/latest" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      {/* Hero Section */}
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Welcome to <span className="text-black">Blogosphere</span>
      </h1>

      <p className="text-gray-600 max-w-xl mb-8 text-lg">
        Share your thoughts, explore amazing blogs, and connect with writers
        around the world. Create, edit, and like blogs — all in one place.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          to="/signup"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;

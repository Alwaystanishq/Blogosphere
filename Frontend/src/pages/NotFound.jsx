import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-indigo-50 to-white">
      {/* 404 */}
      <h1 className="text-8xl md:text-9xl font-bold text-indigo-600 mb-4">
        404
      </h1>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-zinc-800 mb-4">Page Not Found</h2>

      {/* Description */}
      <p className="text-zinc-500 max-w-md mb-8 leading-7">
        The page you're looking for doesn't exist, has been moved, or the URL
        may be incorrect.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transition shadow-md"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;

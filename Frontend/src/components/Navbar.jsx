import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/search?q=${search}`);
    setSearch("");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          Blogosphere
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              {/* Search */}
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-zinc-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </form>

              <Link
                to="/latest"
                className="text-zinc-700 hover:text-indigo-600 font-medium transition"
              >
                Latest
              </Link>

              <Link
                to="/myblog"
                className="text-zinc-700 hover:text-indigo-600 font-medium transition"
              >
                My Blogs
              </Link>

              <Link
                to={`/profile/${user.username}`}
                className="text-zinc-700 hover:text-indigo-600 font-medium transition"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-zinc-700 hover:text-indigo-600 font-medium transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl text-indigo-600"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 border-t bg-white">
          {user ? (
            <>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-zinc-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </form>

              <Link
                onClick={() => setOpen(false)}
                to="/latest"
                className="text-zinc-700 hover:text-indigo-600"
              >
                Latest
              </Link>

              <Link
                onClick={() => setOpen(false)}
                to="/myblog"
                className="text-zinc-700 hover:text-indigo-600"
              >
                My Blogs
              </Link>

              <Link
                onClick={() => setOpen(false)}
                to={`/profile/${user.username}`}
                className="text-zinc-700 hover:text-indigo-600"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="text-zinc-700 hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                onClick={() => setOpen(false)}
                to="/signup"
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-center transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

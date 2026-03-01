import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
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

    navigate(`/latest?q=${search}`);
    setSearch("");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
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
                  className="border px-3 py-1 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </form>

              <Link to="/latest">Latest</Link>
              <Link to="/myblog">My Blogs</Link>
              <Link to={`/profile/${user.username}`}>Profile</Link>

              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-1 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/signup"
                className="bg-black text-white px-4 py-1 rounded-lg"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 border-t">
          {user ? (
            <>
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full"
                />
              </form>

              <Link onClick={() => setOpen(false)} to="/latest">
                Latest
              </Link>

              <Link onClick={() => setOpen(false)} to="/myblog">
                My Blogs
              </Link>

              <Link
                onClick={() => setOpen(false)}
                to={`/profile/${user.username}`}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-black text-white py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link onClick={() => setOpen(false)} to="/login">
                Login
              </Link>

              <Link
                onClick={() => setOpen(false)}
                to="/signup"
                className="bg-black text-white py-2 rounded-lg text-center"
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

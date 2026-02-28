import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Blogosphere
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/latest" className="hover:text-black">
                Latest
              </Link>

              <Link to="/myblog" className="hover:text-black">
                My Blogs
              </Link>

              <Link to={`/profile/${user.username}`}>Profile</Link>

              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-1 rounded-lg hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>

              <Link
                to="/signup"
                className="bg-black text-white px-4 py-1 rounded-lg hover:bg-gray-800"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 border-t">
          {user ? (
            <>
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
<Navbar/>
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

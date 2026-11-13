import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { HiMenu, HiX, HiOutlineSearch, HiOutlinePencilAlt } from "react-icons/hi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logout(); setOpen(false); navigate("/login"); }
    finally { setLoggingOut(false); }
  };
  const handleSearch = (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?${new URLSearchParams({ q: search.trim() })}`);
    setOpen(false);
  };
  const links = () => user ? <>
    <NavLink to="/latest" onClick={() => setOpen(false)}>Discover</NavLink>
    <NavLink to="/liked" onClick={() => setOpen(false)}>Liked</NavLink>
    <NavLink to="/myblog" onClick={() => setOpen(false)}>My stories</NavLink>
    <NavLink to={`/profile/${user.username}`} onClick={() => setOpen(false)}>Profile</NavLink>
    <Link className="nav-write" to="/create" onClick={() => setOpen(false)}><HiOutlinePencilAlt /> Write a story</Link>
    <button className="nav-logout" disabled={loggingOut} onClick={handleLogout}>{loggingOut ? "Signing out…" : "Sign out"}</button>
  </> : <>
    <Link to="/latest" onClick={() => setOpen(false)}>Discover</Link>
    <Link to="/create" onClick={() => setOpen(false)}>Write</Link>
    <NavLink to="/login" onClick={() => setOpen(false)}>Sign in</NavLink>
    <Link className="nav-write" to="/signup" onClick={() => setOpen(false)}>Get started</Link>
  </>;
  const searchForm = () => <form role="search" onSubmit={handleSearch} className="nav-search"><HiOutlineSearch aria-hidden="true" /><input type="search" maxLength={200} aria-label="Search stories" placeholder="Search stories…" value={search} onChange={(event) => setSearch(event.target.value)} /><button type="submit" aria-label="Submit search">↵</button></form>;
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <nav className="site-nav" aria-label="Main navigation">
      <div className="nav-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>Blogosphere<span>.</span></Link>
        <div className="desktop-navigation">{user && searchForm()}<div className="nav-links">{links()}</div></div>
        <button className="mobile-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <HiX /> : <HiMenu />}</button>
      </div>
      {open && <div id="mobile-navigation">{user && searchForm()}<div className="nav-links">{links()}</div></div>}
    </nav>
  </>;
}

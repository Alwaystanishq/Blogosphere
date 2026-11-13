import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  return <footer className="site-footer"><div className="page-shell footer-inner">
    <div><Link className="brand" to="/">Blogosphere<span>.</span></Link><p>A place for your point of view.</p></div>
    <nav aria-label="Footer navigation"><Link to={user ? "/latest" : "/login"}>Read stories</Link><Link to={user ? "/create" : "/signup"}>Write a story</Link><a href="#main-content">Back to top ↑</a></nav>
  </div></footer>;
}

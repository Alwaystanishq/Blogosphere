import { Link, Navigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import useReveal from "../hooks/useReveal";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const scope = useReveal(!loading && !user);
  if (loading) return <div className="page-status" role="status">Opening Blogosphere…</div>;
  if (user) return <Navigate to="/latest" replace />;

  return <div ref={scope} className="editorial-home">
    <section className="home-hero page-shell" aria-labelledby="home-title">
      <div className="home-intro">
        <p data-intro className="home-kicker">Independent voices. Different perspectives.</p>
        <h1 data-intro id="home-title">Good stories.<br />Fresh ideas.</h1>
        <p data-intro className="home-description">A place to read something new,<br className="home-description-break" /> and write something of your own.</p>
        <div data-intro className="home-actions">
          <Link className="button-primary" to="/latest">Start reading</Link>
          <Link className="button-text" to="/create">Write a story</Link>
        </div>
      </div>
      <aside className="home-reading-room" aria-label="Explore Blogosphere">
        <p className="reading-room-label">Make yourself at home</p>
        <ul className="home-paths">
          <li><Link to="/latest"><div><span className="home-path-label">01 / Discover</span><h2>Follow a new thought.</h2><p>Explore stories by topic and find a perspective that stays with you.</p></div><HiArrowRight aria-hidden="true" /></Link></li>
          <li><Link to="/create"><div><span className="home-path-label">02 / Write</span><h2>Give an idea a page.</h2><p>Start with a private draft. Publish when your words are ready.</p></div><HiArrowRight aria-hidden="true" /></Link></li>
          <li><Link to="/latest?sort=popular"><div><span className="home-path-label">03 / Discuss</span><h2>Keep the story going.</h2><p>Leave a comment, ask a question, and talk with other readers.</p></div><HiArrowRight aria-hidden="true" /></Link></li>
        </ul>
      </aside>
    </section>
  </div>;
}

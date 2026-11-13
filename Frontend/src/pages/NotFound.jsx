import { Link } from "react-router-dom";

export default function NotFound() {
  return <div className="not-found"><p aria-hidden="true">404</p><h1>This page slipped away.</h1><p>The address may have changed, or this page may no longer exist. There are more stories back at home.</p><Link to="/" className="button-primary">Go to home</Link></div>;
}

import { HiOutlineBookOpen, HiOutlinePencilAlt } from "react-icons/hi";

export default function AuthLayout({ children, className = "" }) {
  return <div className={`auth-page page-shell ${className}`}>
    <aside className="auth-intro" aria-label="About Blogosphere"><p className="eyebrow">A home for your perspective</p><p className="auth-display">Good stories<br />bring us<br /><em>closer.</em></p><p>Read something that stays with you.<br />Write something that might stay with someone else.</p><div className="auth-benefits"><span><HiOutlinePencilAlt aria-hidden="true" /> Your drafts, your pace</span><span><HiOutlineBookOpen aria-hidden="true" /> New perspectives to explore</span></div></aside>
    <div className="auth-card">{children}</div>
  </div>;
}

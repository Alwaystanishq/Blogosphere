import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

export default function ArticleContent({ article = "", format = "plain" }) {
  if (format !== "markdown") {
    return <div className="whitespace-pre-line break-words">{article}</div>;
  }
  return (
    <div className="article-content">
      <ReactMarkdown remarkPlugins={[remarkBreaks]} skipHtml>{article}</ReactMarkdown>
    </div>
  );
}

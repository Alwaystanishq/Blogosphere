import { useRef, useState } from "react";
import ArticleContent from "./ArticleContent";
import { formatSelection } from "../utils/markdownEditing";

const tools = [
  ["heading", "Heading"], ["bold", "Bold"], ["italic", "Italic"],
  ["list", "Bullet list"], ["ordered", "Numbered list"], ["quote", "Quote"],
  ["link", "Link"], ["code", "Inline code"], ["codeBlock", "Code block"],
];

export default function MarkdownEditor({ value, format, onChange }) {
  const [preview, setPreview] = useState(false);
  const textarea = useRef(null);
  const apply = (action) => {
    const input = textarea.current;
    const result = formatSelection(value, input.selectionStart, input.selectionEnd, action);
    onChange(result.value, "markdown");
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(result.start, result.end);
    });
  };
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
        <label htmlFor="blog-article" className="font-semibold text-zinc-700">Article</label>
        <div className="flex gap-2" aria-label="Editor view">
          <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)} className={`px-3 py-2 rounded-lg ${!preview ? "bg-indigo-100 text-indigo-700" : "text-zinc-600"}`}>Write</button>
          <button type="button" aria-pressed={preview} onClick={() => setPreview(true)} className={`px-3 py-2 rounded-lg ${preview ? "bg-indigo-100 text-indigo-700" : "text-zinc-600"}`}>Preview</button>
        </div>
      </div>
      {!preview && <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Article formatting">
        {tools.map(([action, label]) => <button key={action} type="button" onClick={() => apply(action)} className="border border-zinc-300 rounded-lg px-3 py-1 text-sm hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-500">{label}</button>)}
      </div>}
      <label className="flex items-center gap-2 text-sm text-zinc-600 mb-3">
        <input type="checkbox" checked={format === "markdown"} onChange={(event) => onChange(value, event.target.checked ? "markdown" : "plain")} />
        Enable Markdown formatting
      </label>
      <p id="markdown-help" className="text-sm text-zinc-500 mb-3">Enable Markdown to use headings, links, lists, and code. Formatting buttons enable it automatically. Preview shows how your article will look.</p>
      {preview ? <div role="region" aria-label="Article preview" className="min-h-72 border border-zinc-300 rounded-xl p-4 text-zinc-700">
        {value.trim() ? <ArticleContent article={value} format={format} /> : <p className="text-zinc-500">Your article preview will appear here.</p>}
      </div> : <textarea ref={textarea} id="blog-article" name="article" value={value} onChange={(event) => onChange(event.target.value, format)} aria-describedby="markdown-help" rows="14" placeholder="Write your story here..." className="w-full border border-zinc-300 px-4 py-3 rounded-xl font-mono text-sm focus-visible:outline-indigo-500" />}
    </div>
  );
}

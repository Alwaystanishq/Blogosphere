export function formatSelection(value, start, end, action) {
  const selected = value.slice(start, end);
  let replacement;
  let selectionStart = start;
  let selectionEnd;
  if (action === "heading" || action === "list" || action === "ordered" || action === "quote") {
    const lineStart = start === 0 ? 0 : value.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = end > start && value[end - 1] === "\n" ? end - 1 : value.indexOf("\n", end);
    const blockEnd = lineEnd === -1 ? value.length : lineEnd;
    const block = value.slice(lineStart, blockEnd);
    replacement = block.split("\n").map((line, index) => {
      const prefix = { heading: "## ", list: "- ", ordered: `${index + 1}. `, quote: "> " }[action];
      return prefix + line;
    }).join("\n");
    return {
      value: value.slice(0, lineStart) + replacement + value.slice(blockEnd),
      start: lineStart,
      end: lineStart + replacement.length,
    };
  }
  const formats = {
    bold: ["**", "**", "bold text"],
    italic: ["*", "*", "italic text"],
    link: ["[", "](https://example.com)", "link text"],
    code: ["`", "`", "code"],
    codeBlock: ["\n```\n", "\n```\n", "code here"],
  };
  const [before, after, placeholder] = formats[action];
  replacement = before + (selected || placeholder) + after;
  selectionStart += before.length;
  selectionEnd = selectionStart + (selected || placeholder).length;
  return { value: value.slice(0, start) + replacement + value.slice(end), start: selectionStart, end: selectionEnd };
}

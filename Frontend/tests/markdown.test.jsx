import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import ArticleContent from "../src/components/ArticleContent";
import { formatSelection } from "../src/utils/markdownEditing";

const render = (article, format = "markdown") => renderToStaticMarkup(<ArticleContent article={article} format={format} />);

test("renders headings, emphasis, links, lists, and fenced code", () => {
  const html = render("## Heading\n\n**Bold** and *italic* [site](https://example.com)\n\n- First\n- Second\n\n```js\nconst x = 1;\n```");
  for (const fragment of ["<h2>Heading</h2>", "<strong>Bold</strong>", "<em>italic</em>", 'href="https://example.com"', "<ul>", "<li>First</li>", '<code class="language-js">']) assert.ok(html.includes(fragment), fragment);
});
test("rejects executable HTML and unsafe links", () => {
  const html = render('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n[unsafe](javascript:alert%281%29)');
  assert.ok(!html.includes("<script"));
  assert.ok(!html.includes("onerror="));
  assert.ok(!html.includes("javascript:"));
});
test("plain-text posts retain literal Markdown and escape HTML", () => {
  const html = render("## Literal heading\n<script>text</script>", "plain");
  assert.ok(html.includes("## Literal heading"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<h2>"));
});
test("preserves individual line breaks in Markdown posts", () => {
  assert.match(render("First\nSecond"), /First<br\/>\nSecond/);
});
test("toolbar wraps only selected text and selects inserted placeholders", () => {
  assert.deepEqual(formatSelection("hello world", 6, 11, "bold"), { value: "hello **world**", start: 8, end: 13 });
  const link = formatSelection("", 0, 0, "link");
  assert.equal(link.value, "[link text](https://example.com)");
  assert.equal(link.value.slice(link.start, link.end), "link text");
});
test("list formatting applies to selected lines without changing adjacent lines", () => {
  const result = formatSelection("One\nTwo\nThree", 0, 8, "ordered");
  assert.equal(result.value, "1. One\n2. Two\nThree");
});

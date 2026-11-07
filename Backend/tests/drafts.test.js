import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = (await readFile(new URL("../controllers/BlogController.js", import.meta.url), "utf8"))
  .replace('import Blog from "../models/BlogModel.js";', 'const Blog = globalThis.draftTestBlog;')
  .replace('import User from "../models/userModel.js";', 'const User = globalThis.draftTestUser;');
const model = {};
globalThis.draftTestBlog = model;
globalThis.draftTestUser = { findOne: () => ({ select: async () => ({ _id: "owner" }) }) };
const controller = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
delete globalThis.draftTestBlog;
delete globalThis.draftTestUser;
function response() {
  return { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}
const request = (body = {}) => ({ user: { _id: "owner" }, params: { id: "post" }, body });

test("partial drafts can be saved, but incomplete posts cannot be published", async () => {
  model.create = async (value) => value;
  const draft = response();
  await controller.createBlog(request({ title: "Unfinished", status: "draft" }), draft);
  assert.equal(draft.code, 201);
  assert.equal(draft.body.blog.status, "draft");
  const published = response();
  await controller.createBlog(request({ title: "Unfinished" }), published);
  assert.equal(published.code, 400);
});

test("draft details are restricted to their owner", async () => {
  model.findById = () => ({ populate: async () => ({ status: "draft", writtenBy: { _id: "owner" } }) });
  const other = response();
  await controller.oneBlog({ ...request(), user: { _id: "other" } }, other);
  assert.equal(other.code, 404);
  const owner = response();
  await controller.oneBlog(request(), owner);
  assert.equal(owner.code, 200);
});

test("publishing validates content and preserves ownership restriction", async () => {
  let filter;
  let saved = false;
  model.findOne = async (value) => {
    filter = value;
    return { title: "", article: "", status: "draft", save: async () => { saved = true; } };
  };
  const invalid = response();
  await controller.updateBlog(request({ status: "published" }), invalid);
  assert.equal(invalid.code, 400);
  assert.equal(saved, false);
  const valid = response();
  await controller.updateBlog(request({ title: "Ready", article: "Content", status: "published" }), valid);
  assert.equal(valid.code, 200);
  assert.equal(saved, true);
  assert.deepEqual(filter, { _id: "post", writtenBy: "owner" });
});

test("discovery and likes exclude drafts while including legacy published posts", async () => {
  const filters = [];
  const query = { sort() { return this; }, limit() { return []; }, populate() { return this; }, then(resolve) { resolve([]); } };
  model.find = (filter) => { filters.push(filter); return query; };
  model.aggregate = async (pipeline) => { filters.push(pipeline[0].$match); return []; };
  model.findOne = async (filter) => { filters.push(filter); return null; };
  await controller.getlatestBlog(request(), response());
  await controller.searchBlog({ ...request(), query: { q: "test" } }, response());
  await controller.getLikedBlog(request(), response());
  await controller.getTopLikedBlog(request(), response());
  await controller.toggleLikeBlog(request(), response());
  await controller.profile({ ...request(), params: { username: "writer" } }, response());
  assert.equal(filters.length, 6);
  for (const filter of filters) assert.deepEqual(filter.status, { $ne: "draft" });
});


test("another account cannot modify a draft", async () => {
  model.findOne = async (filter) => {
    assert.equal(filter.writtenBy, "other");
    return null;
  };
  const res = response();
  await controller.updateBlog({ ...request({ title: "Stolen" }), user: { _id: "other" } }, res);
  assert.equal(res.code, 404);
});


test("Markdown format persists on create and update; unknown formats are rejected", async () => {
  model.create = async (value) => value;
  const created = response();
  await controller.createBlog(request({ title: "Formatted", article: "**Content**", articleFormat: "markdown" }), created);
  assert.equal(created.body.blog.articleFormat, "markdown");
  const stored = { title: "Title", article: "Content", status: "draft", save: async () => {} };
  model.findOne = async () => stored;
  const updated = response();
  await controller.updateBlog(request({ articleFormat: "markdown" }), updated);
  assert.equal(updated.code, 200);
  assert.equal(stored.articleFormat, "markdown");
  const invalid = response();
  await controller.createBlog(request({ title: "Title", article: "Content", articleFormat: "html" }), invalid);
  assert.equal(invalid.code, 400);
});

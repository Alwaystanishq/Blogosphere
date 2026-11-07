export function parseTopics({ category, tags }) {
  const topics = {};
  if (category !== undefined) {
    if (typeof category !== "string" || category.trim().toLowerCase().length > 60) {
      return { error: "Category must be text with at most 60 characters" };
    }
    topics.category = category.trim().toLowerCase();
  }
  if (tags !== undefined) {
    if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
      return { error: "Tags must be a list of text values" };
    }
    topics.tags = [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
    if (topics.tags.length > 5 || topics.tags.some((tag) => tag.length > 30)) {
      return { error: "Use up to 5 tags, with at most 30 characters each" };
    }
  }
  return { topics };
}

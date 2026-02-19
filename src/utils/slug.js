// src/utils/slug.js
export function toSlug(value) {
  const s = (value ?? "").toString().trim();
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function fromSlug(value) {
  const s = (value ?? "").toString().trim();
  if (!s) return "";
  return s.replace(/-/g, " ");
}

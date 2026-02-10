export const toSlug = (text) =>
  text.toLowerCase().replace(/ /g, "-").replace(/'/g, "");

export const fromSlug = (slug) =>
  slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

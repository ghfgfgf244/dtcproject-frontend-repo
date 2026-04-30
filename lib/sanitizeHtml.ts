const BLOCKED_TAGS = new Set([
  "script",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "style",
  "base",
  "form"
]);

const URL_ATTRS = new Set(["href", "src", "xlink:href", "action", "formaction"]);

export function sanitizeHtml(rawHtml: string | null | undefined): string {
  if (!rawHtml) {
    return "";
  }

  if (typeof window === "undefined") {
    return rawHtml;
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(rawHtml, "text/html");

  document.querySelectorAll("*").forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    if (BLOCKED_TAGS.has(tagName)) {
      element.remove();
      return;
    }

    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();

      if (name.startsWith("on")) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (URL_ATTRS.has(name) && /^javascript:/i.test(value)) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (name === "style" && /expression|url\s*\(\s*javascript:/i.test(value)) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return document.body.innerHTML;
}

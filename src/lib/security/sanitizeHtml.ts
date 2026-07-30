import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "a",
  "blockquote",
  "br",
  "code",
  "em",
  "h2",
  "h3",
  "h4",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "ul",
];

export function sanitizeRichHtml(html: string): string {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "target"],
    ALLOW_DATA_ATTR: false,
  });

  const container = document.createElement("div");
  container.innerHTML = sanitized;

  container.querySelectorAll<HTMLAnchorElement>("a[target='_blank']").forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  return container.innerHTML;
}

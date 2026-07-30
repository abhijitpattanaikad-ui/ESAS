import assert from "node:assert/strict";
import test from "node:test";
import { htmlToSafeText } from "./content";

test("converts trusted formatting to plain text without executable markup", () => {
  const value = '<p>Hello <strong>player</strong></p><script>steal()</script><p>Line&nbsp;two</p>';
  assert.equal(htmlToSafeText(value), "Hello player\nLine two");
});

import { safeExternalUrl } from "./content";

test("allows only http(s) external links", () => {
  assert.equal(safeExternalUrl("javascript:alert(1)"), null);
  assert.equal(safeExternalUrl("https://example.com/rules"), "https://example.com/rules");
  assert.equal(safeExternalUrl("example.com/rules"), "https://example.com/rules");
});

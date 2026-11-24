// Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { highlight } from "./answer-notes.ts";

test("highlight marks phrases, prefers longer, never overlaps, keeps text intact", () => {
  const text = "First of all, I think it is good. First of all again.";
  const parts = highlight(text, ["First", "First of all", "I think"]);
  assert.equal(parts.map((p) => p.t).join(""), text);
  assert.deepEqual(parts.filter((p) => p.hi).map((p) => p.t), ["First of all", "I think", "First of all"]);
  assert.deepEqual(highlight("abc", []), [{ t: "abc", hi: false }]);
});

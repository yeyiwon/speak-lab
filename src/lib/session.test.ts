// Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSession, drillCount, type DrillConfig } from "./session.ts";
import type { Sentence } from "./types.ts";

const mk = (i: number, extra: Partial<Sentence> = {}): Sentence => ({
  id: `s${i}`, origin: "sample", en: `e${i}`, ko: `k${i}`, part: ((i % 5) + 1) as 1, keywords: [],
  status: "new", ease: 2.5, interval: 0, reps: 0, lapses: 0, due: "2026-11-25", createdAt: i, ...extra,
});
const bank = Array.from({ length: 50 }, (_, i) => mk(i));
const cfg = (c: Partial<DrillConfig>): DrillConfig => ({ order: "random", size: 10, part: "any", display: "both", ...c });
const D = "2026-11-25";

test("size 5/10/20/all and no duplicates", () => {
  for (const size of [5, 10, 20] as const) {
    const ids = buildSession(bank, cfg({ size }), [], D);
    assert.equal(ids.length, size);
    assert.equal(new Set(ids).size, size);
  }
  assert.equal(buildSession(bank, cfg({ size: "all" }), [], D).length, 50);
});

test("fewer sentences than requested → only what exists, no padding", () => {
  assert.equal(buildSession(bank.slice(0, 3), cfg({ size: 10 }), [], D).length, 3);
  assert.equal(drillCount([], cfg({}), []), 0);
});

test("random walks the whole bank before repeating (least-recently-practiced first)", () => {
  const b = bank.map((s) => ({ ...s }));
  const seen = new Set<string>();
  for (let round = 0; round < 5; round++) {
    const ids = buildSession(b, cfg({ size: 10 }), [], D);
    ids.forEach((id, k) => {
      assert.ok(!seen.has(id), `repeat before full cycle: ${id}`);
      seen.add(id);
      b.find((s) => s.id === id)!.lastReviewed = round * 100 + k + 1;
    });
  }
  assert.equal(seen.size, 50);
});

test("order is random, not storage order", () => {
  const a = buildSession(bank, cfg({ size: "all" }), [], D).join();
  const b = buildSession(bank, cfg({ size: "all" }), [], D).join();
  assert.notEqual(a, b);
});

test("weak mode prioritises missed sentences but caps them at 70%", () => {
  const b = bank.map((s, i) => (i < 30 ? { ...s, status: "again" as const, due: "2026-11-24" } : s));
  const ids = buildSession(b, cfg({ order: "weak", size: 10 }), [], D);
  const weak = ids.filter((id) => Number(id.slice(1)) < 30).length;
  assert.equal(weak, 7);
});

test("new-first, picked-only and part filter", () => {
  const b = bank.map((s, i) => (i % 2 ? { ...s, status: "familiar" as const, lastReviewed: 1 } : s));
  assert.ok(buildSession(b, cfg({ order: "new", size: 10 }), [], D).every((id) => Number(id.slice(1)) % 2 === 0));
  assert.deepEqual(new Set(buildSession(bank, cfg({ order: "picked", size: "all" }), ["s1", "s2"], D)), new Set(["s1", "s2"]));
  // picked ignores the count limit: 20 ticked with size 5 → all 20
  const twenty = bank.slice(0, 20).map((s) => s.id);
  assert.equal(buildSession(bank, cfg({ order: "picked", size: 5 }), twenty, D).length, 20);
  assert.ok(buildSession(bank, cfg({ part: 3, size: "all" }), [], D).every((id) => bank.find((s) => s.id === id)!.part === 3));
});

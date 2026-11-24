// Collects every bundled English text that should have a native recording.
import { writeFileSync } from "node:fs";
import { QUESTION_SETS } from "../../src/content/questions";
import { SEED_SENTENCES, SEED_SENTENCES_V2, SEED_SENTENCES_V3, SEED_SENTENCES_V4, SEED_SENTENCES_V5 } from "../../src/content/sentences";

const texts = new Set<string>();
for (const s of [...SEED_SENTENCES, ...SEED_SENTENCES_V2, ...SEED_SENTENCES_V3, ...SEED_SENTENCES_V4, ...SEED_SENTENCES_V5]) texts.add(s.en);
for (const set of QUESTION_SETS)
  for (const q of set.questions) {
    if (set.part === 3 || set.part === 4) texts.add(q.prompt);
    if (q.sample) texts.add(q.sample);
  }
writeFileSync(new URL("./texts.json", import.meta.url), JSON.stringify([...texts], null, 1));
console.log(texts.size, "texts");

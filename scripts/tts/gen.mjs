// Synthesizes missing recordings with Kokoro-82M (Apache-2.0) and converts to AAC via macOS afconvert.
// Usage: cd scripts/tts && npm i && npx tsx dump.ts && node gen.mjs
import { KokoroTTS } from "kokoro-js";
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath decodes %20 etc. — the project path contains spaces.
const root = fileURLToPath(new URL("../../", import.meta.url));
const OUT = join(root, "public/tts");
const MAN = join(root, "src/content/tts-manifest.json");
const norm = (t) => t.replace(/[[\]]/g, "").replace(/\s+/g, " ").trim();
mkdirSync(OUT, { recursive: true });

const texts = JSON.parse(readFileSync(new URL("./texts.json", import.meta.url), "utf8"));
const manifest = existsSync(MAN) ? JSON.parse(readFileSync(MAN, "utf8")) : {};
const todo = texts.map(norm).filter((t) => {
  const id = createHash("sha1").update(t).digest("hex").slice(0, 12);
  manifest[t] = id;
  return !existsSync(join(OUT, id + ".m4a"));
});
console.log(`${todo.length} to synthesize`);
if (todo.length) {
  const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8", device: "cpu" });
  for (const [i, text] of todo.entries()) {
    const id = manifest[text];
    const wav = join(tmpdir(), id + ".wav");
    await (await tts.generate(text, { voice: "af_heart", speed: 1 })).save(wav);
    execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "56000", wav, join(OUT, id + ".m4a")]);
    unlinkSync(wav);
    if ((i + 1) % 10 === 0) console.log(`${i + 1}/${todo.length}`);
  }
}
writeFileSync(MAN, JSON.stringify(manifest));
console.log("manifest entries:", Object.keys(manifest).length);

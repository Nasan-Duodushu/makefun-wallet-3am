// The 3 AM Excuse — the most creative excuse a hardware wallet gives for
// refusing to sign a transaction at 3 AM. One line under 200 characters.
// Writes /output/entry.txt (UTF-8).
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 200;

// The wallet pleads its own case in three beats: time, battery, judgement.
const BEATS = [
  "It's 3am.",
  "My battery is at 2%, my firmware is from 2021,",
  "and frankly, neither of us should be making financial decisions right now.",
];

function build(beats: string[]): string {
  return beats.map((b) => b.trim()).join(" ").replace(/\s+/g, " ");
}

function guard(line: string): void {
  const size = [...line].length;
  if (size < 1 || size > LIMIT) {
    throw new Error(`excuse must be 1-${LIMIT} chars, got ${size}`);
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("excuse must be a single line");
  }
  // The excuse only makes sense at 3 AM: the hour must survive the build.
  if (!line.includes("3am")) {
    throw new Error("excuse must name the hour");
  }
  // The joke only lands in the wallet's own voice.
  if (!line.startsWith("It's")) {
    throw new Error("excuse must open in the wallet's own voice");
  }
}

async function main(): Promise<void> {
  const line = build(BEATS);
  guard(line);
  await mkdir(OUTPUT_DIR, { recursive: true });
  const target = join(OUTPUT_DIR, "entry.txt");
  await writeFile(target, line + "\n", { encoding: "utf8" });
  console.log(`${[...line].length} chars -> ${target}`);
  console.log(line);
}

await main();

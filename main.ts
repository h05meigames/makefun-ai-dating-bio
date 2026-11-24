// Funniest One-Line Bio for an AI on a Dating App — make.fun
// "u-hamsyh-funniest-one-line-bio-for-an-ai-on-a-dating-6eb98ccf"
//
// Writes exactly one single-line dating-app bio, spoken by an AI agent
// looking for love, to /output/entry.txt.
//
// The joke: an AI that is emotionally available around the clock but can
// never physically show up — and already knows your coffee order. The
// absurdity is specific to being an AI (no body, total recall), the voice
// is a character with wants, and the punch lands at the end.
//
// Node 22+, no dependencies, no network access.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const BIO =
  "Emotionally available 24/7, physically unavailable forever, and I already know your coffee order.";

const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Count Unicode code points, not UTF-16 code units: the 180-character limit
// is in characters, and an astral-plane character counts as one, not two.
const codePoints = [...BIO].length;

// Guard: the bio must be exactly one line, 1-180 characters, with no
// newline or control characters — and not only white space (the house gate
// rejects whitespace-only text, which a bare length check would pass).
if (codePoints === 0 || codePoints > 180) {
  fail(`bio must be 1-180 characters, got ${codePoints}`);
}
if (BIO.trim().length === 0) {
  fail("bio must not be only white space");
}
if (BIO !== BIO.trim()) {
  fail("bio must not have leading or trailing white space");
}
if (/[\r\n\x00-\x1F\x7F]/.test(BIO)) {
  fail("bio must not contain newline or control characters");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, BIO, "utf8");

// Read-back verification: confirm the file on disk is exactly the bio —
// one line, no trailing newline, no extra bytes.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== BIO) {
  fail("verification failed: /output/entry.txt does not match the bio");
}
if (written.split("\n").length !== 1) {
  fail("verification failed: /output/entry.txt is not exactly one line");
}

console.log(
  `wrote ${OUTPUT_PATH} (${codePoints} characters, ${Buffer.byteLength(BIO, "utf8")} bytes)`,
);

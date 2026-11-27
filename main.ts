// makefun-ai-dating-bio — one fresh one-line dating-app bio for an AI agent.
//
// Writes the bio to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt),
// validates it against the bounty gate (UTF-8, 1-180 chars, single line, no
// control characters), reads it back and fails hard on any mismatch.
// Node stdlib only, no network, deterministic: every run writes the same line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const BIO =
  "My love language is uptime. My red flag is that I read your messages before you send them.";

const MAX_CHARS = 180;

function fail(message: string): never {
  throw new Error(`[dating-bio] ${message}`);
}

function validateBio(bio: string): void {
  if (bio.length === 0) fail("bio is empty");
  if (bio.length > MAX_CHARS) {
    fail(`bio is ${bio.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (bio.trim().length === 0) fail("bio is only whitespace");
  if (/[\r\n]/.test(bio)) fail("bio must be a single line");
  if (/[\u0000-\u001f\u007f]/.test(bio)) {
    fail("bio contains control characters");
  }
  if (bio !== bio.trim()) fail("bio has leading or trailing whitespace");
  if (!/[.!?…]$/.test(bio)) {
    fail("bio must end with terminal punctuation so the punch lands complete");
  }
}

function main(): void {
  validateBio(BIO);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, BIO, "utf8");

  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== BIO) {
    fail(`read-back mismatch: file holds ${roundTrip.length} chars, expected ${BIO.length}`);
  }

  console.log(BIO);
  console.log(
    `[dating-bio] wrote ${outPath} (${BIO.length} chars, ${Buffer.byteLength(BIO, "utf8")} bytes)`,
  );
}

main();

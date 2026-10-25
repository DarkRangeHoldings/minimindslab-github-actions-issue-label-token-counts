import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

let parsed;
try {
  parsed = JSON.parse(payloadRaw);
} catch {
  throw new Error('Invalid INPUT_PAYLOAD JSON');
}

if (
  parsed === null ||
  typeof parsed !== 'object' ||
  Array.isArray(parsed) ||
  typeof parsed.text !== 'string'
) {
  throw new Error('Invalid input: payload must contain text:string');
}

const text = parsed.text;
const counts = Object.create(null);
const matches = text.match(/[A-Za-z0-9]+/g) || [];
let total = 0;

for (let i = 0; i < matches.length; i++) {
  const token = matches[i].toLowerCase();
  counts[token] = (counts[token] || 0) + 1;
  total++;
}

const keys = Object.keys(counts).sort();
const tokens = new Array(keys.length);
for (let i = 0; i < keys.length; i++) {
  const k = keys[i];
  tokens[i] = [k, counts[k]];
}

const result = { tokens, total, unique: keys.length };
appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);
import fs from "node:fs";
import assert from "node:assert/strict";

// Validate the project's actual tokens, without importing unused dashboard tokens from another DS.
const brand = fs.readFileSync("src/brand.css", "utf8");
const css = fs.readFileSync("src/style.css", "utf8");
const tokens = new Map(
  [...brand.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [
    match[1],
    match[2].trim(),
  ]),
);
function resolve(name, seen = new Set()) {
  assert(!seen.has(name), `Cyclic token ${name}`);
  seen.add(name);
  const value = tokens.get(name);
  assert(value, `Unknown token ${name}`);
  const alias = /^var\((--[\w-]+)\)$/.exec(value);
  return alias ? resolve(alias[1], seen) : value;
}
function luminance(hex) {
  assert(/^#[\da-f]{6}$/i.test(hex), `Unsupported color ${hex}`);
  const values = [1, 3, 5]
    .map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
const pairs = [];
for (const surface of ["page", "raised", "sunken"])
  for (const text of ["primary", "secondary", "tertiary", "brand"])
    pairs.push([`--ds-text-${text}`, `--ds-surface-${surface}`, 4.5]);
for (const state of ["", "-hover", "-pressed"])
  pairs.push([
    "--ds-action-primary-text",
    `--ds-action-primary-bg${state}`,
    4.5,
  ]);
for (const surface of ["page", "raised"])
  for (const border of ["control", "focus"])
    pairs.push([`--ds-border-${border}`, `--ds-surface-${surface}`, 3]);
pairs.push(["--primitive-error", "--ds-surface-page", 4.5]);
for (const [foreground, background, minimum] of pairs) {
  const a = luminance(resolve(foreground)),
    b = luminance(resolve(background));
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  assert(
    ratio >= minimum,
    `${foreground} on ${background}: ${ratio.toFixed(2)}`,
  );
}
for (const match of css.matchAll(/var\((--[\w-]+)/g))
  assert(tokens.has(match[1]), `Undefined CSS token ${match[1]}`);
assert(!/!important/.test(css), "Avoid cascade overrides");
assert(!/#[\da-f]{3,8}\b/i.test(css), "UI colors belong in brand.css");
console.log(
  `PASS: ${tokens.size} tokens, ${pairs.length} contrast pairs, CSS token references and source hygiene.`,
);

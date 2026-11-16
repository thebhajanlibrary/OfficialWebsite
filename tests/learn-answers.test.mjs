import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Module from "node:module";
import ts from "typescript";

const filename = fileURLToPath(new URL("../src/lib/learn/answers.ts", import.meta.url));
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
const loaded = new Module(filename);
loaded._compile(compiled.outputText, filename);
const { matchesVocabularyAnswer: matches, normalizeAnswer } = loaded.exports;
const words = [
  { id: "lota", word: "Lotā", alternativeSpellings: [] },
  { id: "tawa", word: "Tāwā", alternativeSpellings: [] },
  { id: "belna", word: "Belnā", alternativeSpellings: [] },
  { id: "sil", word: "Sil aur loṛhā", alternativeSpellings: [] },
  { id: "dal", word: "Dāl ghotanī", alternativeSpellings: [] },
];

test("case, accents, spaces, and punctuation do not penalize recall", () => {
  assert.equal(normalizeAnswer(" SIL-aur LOṚHĀ! "), "silaurlorha");
  assert.equal(matches("lota", "lota", words), true);
  assert.equal(matches("sil aur lorha", "sil", words), true);
  assert.equal(matches("  DAL-GHOTANI ", "dal", words), true);
});
test("accepts a clear small typo including swapped letters", () => {
  assert.equal(matches("lotta", "lota", words), true);
  assert.equal(matches("blena", "belna", words), true);
  assert.equal(matches("sil ar lorha", "sil", words), true);
});
test("rejects the name of another utensil, even when it is misspelled", () => {
  assert.equal(matches("tawa", "lota", words), false);
  assert.equal(matches("tawwa", "lota", words), false);
});
test("rejects empty, unrelated, very short, or excessively long input", () => {
  for (const input of ["", "   ", "?", "l", "potato", "a".repeat(101)]) assert.equal(matches(input, "lota", words), false);
});
test("rejects ambiguous typos instead of guessing", () => {
  const ambiguous = [{ id: "a", word: "bela", alternativeSpellings: [] }, { id: "b", word: "beli", alternativeSpellings: [] }];
  assert.equal(matches("belo", "a", ambiguous), false);
});
test("supports explicitly supplied alternative spellings", () => {
  assert.equal(matches("rolling pin", "belna", [{ ...words[2], alternativeSpellings: ["rolling pin"] }]), true);
});

test("accepts dictionary-backed names and still distinguishes different utensils", () => {
  const vocabulary = [
    { id: "simta", word: "Simtā", alternativeSpellings: [], acceptedNames: ["chimta"] },
    { id: "dal", word: "Dāl ghotanī", alternativeSpellings: [], acceptedNames: ["ghotni"] },
    { id: "kalchhul", word: "Kalchhul", alternativeSpellings: [], acceptedNames: ["daboo"] },
    { id: "dabla", word: "Dablā", alternativeSpellings: [] },
    { id: "thariya", word: "Thariyā", alternativeSpellings: [], acceptedNames: ["tari", "thali"] },
    { id: "sil", word: "Sil aur loṛhā", alternativeSpellings: [], acceptedNames: ["lohra & sil"] },
  ];
  for (const [input, id] of [["chimta", "simta"], ["ghotni", "dal"], ["daboo", "kalchhul"], ["thali", "thariya"], ["tari", "thariya"], ["lohra and sil", "sil"]]) {
    assert.equal(matches(input, id, vocabulary), true, input);
  }
  assert.equal(matches("dabla", "kalchhul", vocabulary), false);
  assert.equal(matches("daboo", "dabla", vocabulary), false);
});

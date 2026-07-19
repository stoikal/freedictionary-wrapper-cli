import pc from "picocolors";
import type { Entry, Form, Sense } from "../type";
import type { PrintContext } from "./context";
import { sliceWithEllipsis } from "./limit";

function pad(depth: number): string {
  return " ".repeat(3 + depth * 2);
}

function pronunciationsLine(entry: Entry): string {
  return entry.pronunciations.map((p) => p.text).join(" ");
}

export function printHeader(word: string, entry: Entry, entryNum: number) {
  const theWord = pc.bold(word);
  const parts = [pc.green(`${entryNum}. ${theWord}`)];
  if (entry.partOfSpeech) parts.push(pc.yellow(` (${entry.partOfSpeech})`));
  const pron = pronunciationsLine(entry);
  if (pron) parts.push(pc.dim(` ${pron}`));

  console.log(parts.join(""));
}

export function printForms(forms: Form[], limit: number) {
  if (!forms.length) return;

  console.log(pc.dim("   forms:"));
  const { items, truncated } = sliceWithEllipsis(forms, limit);
  for (const form of items) printForm(form, 0);
  if (truncated) console.log("   ...");
}

function printForm(form: Form, depth: number) {
  console.log(pad(depth) + "- " + form.word);
}

function printWordList(label: string, words: string[], limit: number, depth: number) {
  if (!words.length) return;
  console.log(pad(depth) + pc.dim(`${label}:`));
  const { items, truncated } = sliceWithEllipsis(words, limit);
  for (const w of items) console.log(pad(depth) + "  - " + w);
  if (truncated) console.log(pad(depth) + "  ...");
}

export function printEntrySynonyms(synonyms: string[], limit: number) {
  printWordList("synonyms", synonyms, limit, 0);
}

export function printEntryAntonyms(antonyms: string[], limit: number) {
  printWordList("antonyms", antonyms, limit, 0);
}

export function printSenses(senses: Sense[], ctx: PrintContext) {
  if (!senses.length) return;

  console.log(pc.dim("   definitions:"));
  const { items, truncated } = sliceWithEllipsis(senses, ctx.limit);
  for (const sense of items) printSense(sense, 0, ctx);
  if (truncated) console.log("   ...");
}

function printSense(sense: Sense, depth: number, ctx: PrintContext) {
  console.log(pc.white(pad(depth) + "- " + sense.definition));

  if (ctx.showSynonyms) printWordList("synonyms", sense.synonyms ?? [], ctx.limit, depth + 1);
  if (ctx.showAntonyms) printWordList("antonyms", sense.antonyms ?? [], ctx.limit, depth + 1);

  if (ctx.showExamples && sense.examples?.length) {
    console.log(pad(depth) + pc.dim("  examples:"));
    const { items, truncated } = sliceWithEllipsis(sense.examples, ctx.limit);
    for (const example of items) {
      console.log(pc.dim(pc.italic(pad(depth) + '  "' + example + '"')));
    }
    if (truncated) console.log(pad(depth) + "  ...");
  }

  const subs = sense.subsenses ?? [];
  const { items: subSenses, truncated: subTruncated } = sliceWithEllipsis(
    subs,
    ctx.limit,
  );
  for (const sub of subSenses) printSense(sub, depth + 1, ctx);
  if (subTruncated) console.log(pad(depth) + "  ...");
}

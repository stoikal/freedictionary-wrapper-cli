import pc from "picocolors";
import stringWidth from "string-width";
import type { Entry, Form, Sense } from "../type";
import type { PrintContext } from "./context";
import { sliceWithEllipsis } from "./limit";

function pad(depth: number): string {
  return " ".repeat(3 + depth * 2);
}

function pronunciationsLine(entry: Entry): string {
  return entry.pronunciations.map((p) => p.text).join(" ");
}

function printWrapped(
  prefix: string,
  text: string,
  continuationIndent: number,
  style: (s: string) => string,
) {
  const cols = process.stdout.columns ?? 80;
  const words = text.trim().split(/\s+/);
  if (!words.length || !words[0]) { console.log(style(prefix)); return; }

  const firstAvail = cols - stringWidth(prefix);
  const contAvail = cols - continuationIndent;

  if (stringWidth(text.trim()) <= firstAvail) {
    console.log(style(prefix + text.trim()));
    return;
  }

  const indent = " ".repeat(continuationIndent);
  const allLines: string[] = [];
  let lineWords: string[] = [];
  let isFirst = true;
  let avail = firstAvail;

  for (const word of words) {
    const test = lineWords.length ? lineWords.join(" ") + " " + word : word;
    if (stringWidth(test) <= avail) {
      lineWords.push(word);
    } else {
      allLines.push(lineWords.join(" "));
      lineWords = [word];
      avail = contAvail;
      isFirst = false;
    }
  }
  if (lineWords.length) {
    allLines.push(lineWords.join(" "));
  }

  for (let i = 0; i < allLines.length; i++) {
    const line = (i === 0 ? prefix : indent) + allLines[i];
    console.log(style(line));
  }
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
  printWrapped(pad(depth) + "- ", form.word, pad(depth).length + 2, (s) => s);
}

function printWordList(label: string, words: string[], limit: number, depth: number) {
  if (!words.length) return;
  console.log(pad(depth) + pc.dim(`${label}:`));
  const indent = pad(depth).length + 4;
  const { items, truncated } = sliceWithEllipsis(words, limit);
  for (const w of items) printWrapped(pad(depth) + "  - ", w, indent, (s) => s);
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
  printWrapped(pad(depth) + "- ", sense.definition, pad(depth).length + 2, pc.white);

  if (ctx.showSynonyms) printWordList("synonyms", sense.synonyms ?? [], ctx.limit, depth + 1);
  if (ctx.showAntonyms) printWordList("antonyms", sense.antonyms ?? [], ctx.limit, depth + 1);

  if (ctx.showExamples && sense.examples?.length) {
    console.log(pad(depth) + pc.dim("  examples:"));
    const exIndent = pad(depth).length + 4;
    const { items, truncated } = sliceWithEllipsis(sense.examples, ctx.limit);
    for (const example of items) {
      printWrapped(pad(depth) + "  ", `"${example}"`, exIndent, (s) => pc.dim(pc.italic(s)));
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

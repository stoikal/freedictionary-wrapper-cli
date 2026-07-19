#!/usr/bin/env bun
import pc from "picocolors";
import { buildProgram } from "./src/cli";
import { fetchWord } from "./src/api";
import { printEntryAntonyms, printEntrySynonyms, printForms, printHeader, printSenses } from "./src/format";
import { parseResultNum, sliceWithEllipsis } from "./src/limit";
import { withSpinner } from "./src/spinner";
import type { Options } from "./type";

async function handleWord(word: string, options: Options) {
  const data = await withSpinner(`fetching "${word}"...`, () => fetchWord(word, options.lang));

  if (!data.entries.length) {
    console.log(pc.red("not found"));
    return;
  }

  const limit = parseResultNum(options.result);
  const { items: results } = sliceWithEllipsis(data.entries, limit);

  for (const [index, entry] of results.entries()) {
    printHeader(word, entry, index + 1);

    if (options.showForms) printForms(entry.forms ?? [], limit);
    if (options.showSynonyms) printEntrySynonyms(entry.synonyms ?? [], limit);
    if (options.showAntonyms) printEntryAntonyms(entry.antonyms ?? [], limit);
    if (options.definitions) printSenses(entry.senses, { limit, showExamples: options.showExamples, showSynonyms: options.showSynonyms, showAntonyms: options.showAntonyms });
  }
}

buildProgram(handleWord).parse();

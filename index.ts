#!/usr/bin/env bun
import pc from "picocolors";
import { buildProgram } from "./src/cli";
import { fetchWord } from "./src/api";
import { printForms, printHeader, printSenses } from "./src/format";
import { parseResultNum, sliceWithEllipsis } from "./src/limit";
import type { Options } from "./type";

async function handleWord(word: string, options: Options) {
  const data = await fetchWord(word, options.lang);

  if (!data.entries.length) {
    console.log(pc.red("not found"));
    return;
  }

  const limit = parseResultNum(options.result);
  const { items: results } = sliceWithEllipsis(data.entries, limit);

  for (const [index, entry] of results.entries()) {
    printHeader(word, entry, index + 1);

    if (options.showForms) printForms(entry.forms ?? [], limit);
    if (options.definitions) printSenses(entry.senses, { limit, showExamples: options.showExamples });
  }
}

buildProgram(handleWord).parse();

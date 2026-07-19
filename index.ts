#!/usr/bin/env bun
import { Command } from "commander";
import pc from "picocolors";
import type { Entry, Form, FreeDictionaryResponse, Options, Sense } from "./type";

const program = new Command();

program
  .argument("<word>", "The word to search for")
  .option("-l, --lang <code>", "Language code (e.g. de, en)", "de")
  .option("-f, --show-forms", "Show forms", false)
  .option("--no-definitions", "Show definitions",)
  .option("-r, --result <num>", "Number of results", "5")
  .option("-x, --show-examples", "Show examples", false)
  .action((word, options: Options) => {
    handleWord(word, options)
      .catch((e) => {
        console.log(pc.red(e))
      })
  });

program.parse();

async function handleWord(word: string, options: Options) {
  const data = await fetchWord(word, options.lang);

  if (!data.entries.length) {
    return console.log(pc.red("not found"))
  }

  const limit = parseResultNum(options.result);
  const results = data.entries.slice(0, limit);

  results.forEach((entry, index) => {
    printHeader(word, entry, index + 1);

    if (options.showForms && entry.forms && entry.forms.length > 0) {
      console.log(pc.dim("   forms:"))
      const forms = entry.forms.slice(0, limit);
      forms.forEach(form => printForm(form));

      if (entry.forms.length > forms.length) {
        console.log("   ...")
      }
    }

    if (options.definitions) {
      console.log(pc.dim("   definitions:"))
      const senses = entry.senses.slice(0, limit);
      senses.forEach(sense => printDefinition(sense, 0, limit, options.showExamples));

      if (entry.senses.length > senses.length) {
        console.log("   ...")
      }
    }
  })
}


async function fetchWord(word: string, lang: string): Promise<FreeDictionaryResponse> {
  const BASE_URL = "https://freedictionaryapi.com/api/v1/entries";
  const url = `${BASE_URL}/${lang}/${word}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<FreeDictionaryResponse>;
}

function getPronounciations(entry: Entry): string | null {
  return entry.pronunciations
    .map((item) => item.text)
    .join(" ")
}

function printHeader(word: string, entry: Entry, entryNum: number) {
  let header = pc.green(`${entryNum}. ${word}`)

  if (entry.partOfSpeech) header += pc.yellow(` (${entry.partOfSpeech})`);
  const pronounciations = getPronounciations(entry);
  if (pronounciations) header += pc.dim(` ${pronounciations}`);



  console.log(header);
}

function printDefinition(sense: Sense, depth: number = 0, limit: number, showExamples: boolean = false) {
  const pad = 3 + depth * 2;
  console.log(pc.white(" ".repeat(pad) + "- " + sense.definition))

  if (showExamples && sense.examples && sense.examples.length) {
    console.log(" ".repeat(pad) + pc.dim("  examples:"))
    const examples = sense.examples.slice(0, limit);
    examples.forEach((example) => {
      console.log(pc.dim(pc.italic(" ".repeat(pad) + "  \"" + example + "\"")))
    })
  }

  const subsenses = sense.subsenses?.slice(0, limit);
  subsenses?.forEach((subsense) => {
    printDefinition(subsense, depth + 1, limit)
  })

  if ((sense.subsenses?.length || 0) > (subsenses?.length || 0)) {
    console.log(" ".repeat(pad) + "  ...")
  }
}

function printForm(form: Form, depth: number = 0) {
  const pad = 3 + depth * 2;
  console.log(" ".repeat(pad) + "- " + form.word)
}

function parseResultNum(resultArg: string): number {
  if (resultArg === "all") return Infinity
  return parseInt(resultArg) || 0
}
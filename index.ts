import { Command } from "commander";
import pc from "picocolors";
import type { Entry, Form, FreeDictionaryResponse, Sense } from "./type";

const program = new Command();

program
  .argument("<word>", "The word to search for")
  .option("-l, --lang <code>", "Language code (e.g. de, en)", "de")
  .action((word, options) => {
    handleWord(word, options.lang)
      .catch(() => {
        console.log(pc.red("error"))
      })
  });

program.parse();

async function handleWord(word: string, lang: string) {
  const data = await fetchWord(word, lang)

  if (!data.entries.length) {
    return console.log(pc.red("not found"))
  }

  data.entries.forEach((entry, index) => {
    printHeader(word, entry, index + 1)

    if (entry.forms && entry.forms.length > 0) {
      console.log(pc.dim("   forms:"))
      entry.forms.forEach(form => printForm(form));
    }

    console.log(pc.dim("   definitions:"))
    entry.senses.forEach(sense => printDefinition(sense));
  })
}


async function fetchWord(word: string, lang: string): Promise<FreeDictionaryResponse> {
  const BASE_URL = "https://freedictionaryapi.com/api/v1/entries";
  const url = `${BASE_URL}/${lang}/${word}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.log(876)
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

  const pronounciations = getPronounciations(entry);
  if (pronounciations) header += pc.dim(` ${pronounciations}`);

  if (entry.partOfSpeech) header += pc.yellow(` (${entry.partOfSpeech})`);

  header += ":";

  console.log(header);
}

function printDefinition(sense: Sense, depth: number = 0) {
  const pad = 3 + depth * 2;
  console.log("".padStart(pad) + "- " + sense.definition)

  sense.subsenses?.forEach((subsense) => {
    printDefinition(subsense, depth + 1)
  })
}

function printForm(form: Form, depth: number = 0) {
  const pad = 3 + depth * 2;
  console.log("".padStart(pad) + "- " + form.word)
}
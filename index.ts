import { Command } from "commander";
import type { Entry, FreeDictionaryResponse, Sense } from "./type";

const program = new Command();

program
  .argument("<word>", "The word to search for")
  .action((word) => {
    handleWord(word)
  });

program.parse();

async function handleWord(word: string) {
  const data = await fetchWord(word)

  data.entries.forEach((entry, index) => {
    printHeader(word, entry, index + 1)

    entry.senses.forEach((sense) => {
      printSense(sense)
    })
  })
}


async function fetchWord(word: string): Promise<FreeDictionaryResponse> {
  const BASE_URL = "https://freedictionaryapi.com/api/v1/entries/de";
  const url = `${BASE_URL}/${word}`;

  const response = await fetch(url);
  return response.json() as Promise<FreeDictionaryResponse>;
}

function getIpa(entry: Entry): string | null {
  const found = entry.pronunciations?.find((item) => item.type === "ipa");

  if (!found) return null;

  return found.text;
}

function printHeader(word: string, entry: Entry, entryNum: number) {
  const ipa = getIpa(entry);

  let header = `${entryNum}. ${word}`

  if (ipa) {
    header += ` ${ipa}`
  }

  if (entry.partOfSpeech) {
    header += ` (${entry.partOfSpeech})`
  }

  header += ":";

  console.log(header);
}

function printSense(sense: Sense) {
  console.log("   - " + sense.definition)
}
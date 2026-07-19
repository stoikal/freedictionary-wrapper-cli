import { Command } from "commander";
import pc from "picocolors";
import type { Options } from "../type";

export type Action = (word: string, options: Options) => Promise<void> | void;

export function buildProgram(action: Action): Command {
  const program = new Command();

  program
    .argument("<word>", "The word to search for")
    .option("-l, --lang <code>", "Language code (e.g. de, en)", "de")
    .option("-f, --show-forms", "Show forms", false)
    .option("--no-definitions", "Show definitions")
    .option("-r, --result <num>", "Number of results", "5")
    .option("-x, --show-examples", "Show examples", false)
    .option("-s, --show-synonyms", "Show synonyms", false)
    .option("-a, --show-antonyms", "Show antonyms", false)
    .action(async (word: string, options: Options) => {
      try {
        await action(word, options);
      } catch (e) {
        console.error(pc.red(String(e)));
        process.exit(1);
      }
    });

  return program;
}

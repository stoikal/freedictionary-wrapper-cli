import type { FreeDictionaryResponse } from "../type";

const BASE_URL = "https://freedictionaryapi.com/api/v1/entries";

export async function fetchWord(
  word: string,
  lang: string,
): Promise<FreeDictionaryResponse> {
  const url = `${BASE_URL}/${lang}/${word}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<FreeDictionaryResponse>;
}

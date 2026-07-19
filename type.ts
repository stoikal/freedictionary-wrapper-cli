export type Options = {
    lang: string;
    showForms: boolean;
    result: string;
    definitions: boolean;
    showExamples: boolean;
}

export type FreeDictionaryResponse = {
    word: string;
    entries: Entry[];
    source: Source;
}

type Source = {
    url: string;
    license: {
        name: string;
        url: string;
    }
}

export type Entry = {
    language: Language;
    partOfSpeech: string;
    pronunciations: Pronunciation[];
    forms: Form[];
    senses: Sense[];
    synonyms: string[];
    antonyms: string[];
}

type Language = {
    name: string;
    code: string;
}

type Pronunciation = {
    type: string;
    text: string;
    tags: string[];
}

export type Form = {
    word: string;
    tags: string[];
}

export type Sense = {
    definition: string;
    tags: string[];
    examples: string[];
    quotes: Quote[];
    synonyms: string[];
    antonyms: string[];
    translations?: Translation[];
    subsenses?: Sense[];
}

type Quote = {
    text: string;
    reference: string;
}

type Translation = {
    language: Language;
    word: string;
}

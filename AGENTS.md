# freedictionary-wrapper-cli

## Runtime
- Bun v1.3+ (TypeScript, native `fetch`, no bundler)
- `bun run index.ts <word>` to run

## Structure
```
index.ts              Entry point (shebang) → handleWord()
src/
  cli.ts              Commander program builder
  api.ts              HTTP fetch wrapper
  format.ts           All display/printing logic
  limit.ts            Result limiting utilities
  spinner.ts          Loading spinner
  argv.ts             Combined short-flag expander (-txa → -t -x -a)
  context.ts          PrintContext type
type.ts               All TypeScript types
```

## Conventions

### Options flow
- CLI flags defined in `cli.ts` → `Options` type in `type.ts`
- Display options passed to format functions via `PrintContext` (`context.ts`)
- Boolean flags default to `false` unless `--no-` prefix is used

### Formatting (`format.ts`)
- `pad(depth)` → 3 + depth*2 spaces for indentation
- `printWrapped(prefix, text, continuationIndent, style)` handles word-wrap with `string-width`
- Every wrapped line gets same `style()` applied
- `printSense()` builds inline styled text (tags dim, definition white per-word) and passes `s => s` style
- Tags deduped against parenthetical groups in definition text

### Wrapping
- Uses `string-width` (not `.length`) for accurate visual width with ANSI codes
- Continuation lines get `continuationIndent` spaces (no bullet)

### Combined flags
- `-txa` style combining supported via `expandCombined()` in `argv.ts`
- Only boolean flags (f, x, s, a, t, h) can be combined; value flags (l, r) cannot

### Adding a new feature
1. Add field to `Options` in `type.ts`
2. Add flag in `cli.ts`
3. Add field to `PrintContext` if needed
4. Add display function in `format.ts`
5. Wire up in `index.ts`

### Dependencies
- `commander` — CLI parsing
- `picocolors` — terminal colors (lightweight)
- `string-width` — accurate ANSI-aware width measurement

## No tests yet

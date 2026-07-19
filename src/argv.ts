const boolFlags = new Set(["f", "x", "s", "a", "t", "h"]);

export function expandCombined(argv: string[]): string[] {
  const out: string[] = [];
  for (const arg of argv) {
    if (arg.startsWith("-") && !arg.startsWith("--") && arg.length > 2) {
      const rest = arg.slice(1);
      if ([...rest].every(c => boolFlags.has(c))) {
        for (const c of rest) out.push("-" + c);
        continue;
      }
    }
    out.push(arg);
  }
  return out;
}

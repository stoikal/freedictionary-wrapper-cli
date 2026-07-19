export function parseResultNum(s: string): number {
  if (s === "all") return Infinity;
  const n = Number.parseInt(s, 10);
  if (!Number.isFinite(n) || n < 1) {
    throw new Error(`invalid --result value: ${JSON.stringify(s)}`);
  }
  return n;
}

export function sliceWithEllipsis<T>(
  arr: T[],
  limit: number,
): { items: T[]; truncated: boolean } {
  if (limit === Infinity || arr.length <= limit) {
    return { items: arr, truncated: false };
  }
  return { items: arr.slice(0, limit), truncated: true };
}

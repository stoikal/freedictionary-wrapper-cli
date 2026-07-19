export function getDigitCount(num: number) {
  if (num === 0) return 1; // Edge case for 0
  return Math.floor(Math.log10(Math.abs(num))) + 1;
}
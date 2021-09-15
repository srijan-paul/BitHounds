import { AssertionError } from "assert";
// Returns a random integer
export function randInt(lo: number, hi: number): number {
  return Math.floor(lo + Math.random() * hi);
}

// Returns a random element from the array `arr`.
export function randChoice<T>(arr: T[]): T {
  return arr[randInt(0, arr.length)];
}

// eslint-disable-next-line
export function assert(cond: any, message?: string): any {
  if (!cond) throw new AssertionError({ message: message || "Assertion failed" });
  return cond;
}

// Generates a random base62 string of length `len`
export function randomBase62(len: number): string {
  const lCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uCaseChars = lCaseChars.toUpperCase();
  const digits = "0123456789";

  const allChars = digits + lCaseChars + uCaseChars;

  let res = "";
  for (let i = 0; i < len; ++i) {
    res += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return res;
}

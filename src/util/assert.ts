import { AssertionError } from "assert";

export function assert(cond: any, message?: string) {
  if (!cond) throw new AssertionError({ message });
  return cond;
}

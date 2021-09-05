import { AssertionError } from "assert";

// eslint-disable-next-line
export function assert(cond: any, message?: string): any{
  if (!cond) throw new AssertionError({ message });
  return cond;
}

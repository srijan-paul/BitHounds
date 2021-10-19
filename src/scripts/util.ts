import { AssertionError } from "assert";
import { TzContext } from "../components/context/TzToolKitContext";
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

export function shortString(str: string, limit = 20): string {
  if (str.length < limit) return str;
  return str.substring(0, limit - 3) + "...";
}

function stringToHex(string: string) {
  let result = "";
  for (let i = 0; i < string.length; i++) {
    result += string.charCodeAt(i).toString(16);
  }
  return result;
}

export async function buyHound(
  tzContext: TzContext,
  genome: string,
  userAddress: string
): Promise<void> {
  try {
    const contract = tzContext.contract;
    if (!contract) return;
    const response = await fetch(
      `http://localhost:8080/mint?creator=${userAddress}&genome=${genome}`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ genome, creator: userAddress }),
      }
    );
    const json = await response.json();
    console.log(typeof json.msg.metadataHash);
    console.log(stringToHex(json.msg.metadataHash));
    const op = await contract.methods
      .createHound(4, genome, stringToHex("ipfs://" + json.msg.metadataHash), 0)
      .send();
    await op.confirmation();
    await tzContext.loadContract();
  } catch (error) {
    console.error(error);
  }
}

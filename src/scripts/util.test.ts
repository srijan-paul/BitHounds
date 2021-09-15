import { assert } from "console";
import { randomBase62 } from "./util";

describe("Random base62 string generator", () => {
  it("Returns strings of expected length", () => {
    expect(randomBase62(40).length).toBe(40);
  });

  const lChars = "abcdefghijklmnopqrstuvwxyz";
  const uChars = lChars.toUpperCase();
  const digits = "0123456789";
  const allChars = lChars + uChars + digits;

  it("returns valid base62 genomes", () => {
    const s = randomBase62(20);
    assert(s.length == 20);
    for (const c of s) {
      expect(typeof c).toBe("string");
      expect(allChars.includes(c)).toBe(true);
    }
  });
});

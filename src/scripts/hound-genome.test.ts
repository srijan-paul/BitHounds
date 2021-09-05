import { AssertionError } from "assert";
import { decodeBase62Quadlet, decodeGenome } from "./hound-genome";

describe("Base62 Quadlet decoder", () => {
  it("Can decode base62 quadlets", () => {
    expect(decodeBase62Quadlet("ZZZZ")).toBe(14776335);
    expect(decodeBase62Quadlet("zzzz")).toBe(8478225);
    expect(decodeBase62Quadlet("aaaa")).toBe(2422350);
    expect(decodeBase62Quadlet("1234")).toBe(246206);
    expect(decodeBase62Quadlet("12aB")).toBe(246673);
  });

  it("Does not allow decoding strings that aren't quadlets", () => {
    expect(() => decodeBase62Quadlet("ZZZZZ")).toThrow(AssertionError);
    expect(() => decodeBase62Quadlet("12")).toThrow(AssertionError);
  });
});

describe("Genome decoder", () => {
  it("Does not allow genomes of incorrect size", () => {
    expect(() => decodeGenome("xx")).toThrow(AssertionError);
  });

  it("Decodes the genomes correctly", () => {
    const sample = decodeGenome("zzzz".repeat(10));
    expect(sample.base).toBe(8478225);
    expect(sample.mouth).toBe(8478225);
    expect(sample.eyes).toBe(8478225);
    expect(sample.horn).toBe(8478225);
  });
});

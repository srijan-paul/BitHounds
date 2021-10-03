import { AssertionError } from "assert";
import { decodeGenome } from "./hound-genome";

describe("Genome decoder", () => {
  it("Does not allow genomes of incorrect size", () => {
    expect(() => decodeGenome("xx")).toThrow(AssertionError);
  });

  it("Decodes the genomes correctly", () => {
    const sample = decodeGenome("0000".repeat(10));
    expect(sample.base).toBe(0);
    expect(sample.mouth).toBe(0);
    expect(sample.eyes).toBe(0);
    expect(sample.horn).toBe(0);
  });
});

import { genomeNumberToImageIndex } from "./generate-hounds";

describe("Map quadlet to asset index", () => {
  it("can map quadlet values to indices correctly", () => {
    expect(genomeNumberToImageIndex(0)).toBe(0);
  });
});

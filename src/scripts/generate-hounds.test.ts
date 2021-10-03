import { genomeNumberToImageIndex } from "./generate-hounds";
import { decodeBase62Quadlet } from "./hound-genome";

describe("Map quadlet to asset index", () => {
  it("can map quadlet values to indices correctly", () => {
    expect(genomeNumberToImageIndex(0)).toBe(0);
  });
});

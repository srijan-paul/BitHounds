import { genomeNumberToImageIndex } from "./generate-hounds";
import { decodeBase62Quadlet } from "./hound-genome";

describe("Map quadlet to asset index", () => {
  it("can map quadlet values to indices correctly", () => {
    const maxQuadlet = decodeBase62Quadlet("ZZZZ");
    expect(genomeNumberToImageIndex(maxQuadlet / 5)).toBe(1);
  });
});

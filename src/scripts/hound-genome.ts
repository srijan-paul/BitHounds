import { assert } from "../util/assert";

// maps a Hound's feature to it's corresponding number in the Genome.
// eg: mouth -> 1202
export type HoundGenomeData = {
  mouth: number;
  horn: number;
  base: number;
  eyes: number;
};

export function decodeBase62Quadlet(quadlet: string): number {
  assert(quadlet.length == 4, "expected a string of length 4");

  const isUpper = (code: number) => code >= 65 && code <= 90;
  const isLower = (code: number) => code >= 97 && code <= 122;
  const isDigit = (code: number) => code >= 48 && code <= 57;

  const base62ToBase10 = (code: number) => {
    if (isLower(code)) return 10 + (code - 97);
    if (isUpper(code)) return 36 + (code - 65);
    assert(isDigit(code));
    return code - 48;
  };

  let ret = 0;
  let pow = quadlet.length - 1;
  for (let i = 0; i < quadlet.length; ++i) {
    const ascii = quadlet.charCodeAt(i);
    ret += base62ToBase10(ascii) * Math.pow(62, pow);
    --pow;
  }

  return ret;
}

export function decodeGenome(genome: string): HoundGenomeData {
  assert(genome.length == 40, "Invalid hound DNA sequence (must be 40 characters)");
  let quadlets = genome.match(/.{1,4}/g);
  assert(quadlets && quadlets.length == 10);
  quadlets = quadlets as RegExpMatchArray;

  const base = decodeBase62Quadlet(quadlets[0]);
  const eyes = decodeBase62Quadlet(quadlets[1]);
  const mouth = decodeBase62Quadlet(quadlets[2]);
  const horn = decodeBase62Quadlet(quadlets[3]);

  return {
    base,
    eyes,
    mouth,
    horn,
  };
}

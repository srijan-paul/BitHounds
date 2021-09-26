import { assert } from "./util";

// maps a Hound's feature to it's corresponding number in the Genome.
// eg: mouth -> 1202
export type HoundGenomeData = {
  [key: string]: number;
};

export const enum HoundRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  MYTHICAL = "mythical",
}

export type HoundInfo = {
  nick: string;
  generation: number;
  id: number;
  genome: string;
  rarity: HoundRarity;
};

const isUpper = (code: number) => code >= 65 && code <= 90;
const isLower = (code: number) => code >= 97 && code <= 122;
const isDigit = (code: number) => code >= 48 && code <= 57;

const base62ToBase10 = (code: number) => {
  if (isLower(code)) return 10 + (code - 97);
  if (isUpper(code)) return 36 + (code - 65);
  assert(isDigit(code));
  return code - 48;
};

const base62CharToBase10Int = (char: string) => {
  return base62ToBase10(char.charCodeAt(0));
};

export function decodeBase62Quadlet(quadlet: string): number {
  assert(quadlet.length == 4, "expected a string of length 4");

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
  const quadlets = genome.substring(0, 5);
  const [base, eyes, mouth, horn] = Array.from(quadlets).map(base62CharToBase10Int);

  return {
    base,
    eyes,
    mouth,
    horn,
  };
}

export function isGenomeValid(genome: string): boolean {
  if (genome.length != 40) return false;
  for (const char of genome) {
    const ascii = char.charCodeAt(0);
    if (!(isUpper(ascii) || isLower(ascii) || isDigit(ascii))) {
      return false;
    }
  }
  return true;
}

export function breedHoundGenomes(parentA: string, parentB: string): string {
  assert(isGenomeValid(parentA) && isGenomeValid(parentB), "Invalid genomes.");

  let childGenome = "";
  for (let i = 0; i < parentA.length; ++i) {
    childGenome += Math.random() > 0.5 ? parentA[i] : parentB[i];
  }

  assert(isGenomeValid(childGenome));
  return childGenome;
}

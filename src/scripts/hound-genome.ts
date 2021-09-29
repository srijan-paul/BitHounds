import { assert } from "./util";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  names,
  animals,
  colors,
} from "unique-names-generator";

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

export type moon = "sanguine" | "blood" | "twilight";
export type mood = "cool" | "angry" | "calm" | "funky" | "tired";

export type HoundStats = {
  mood: mood;
  moon: moon;
  traits: string[];
  spiritAnimal: string;
};

export type HoundInfo = {
  name: string;
  generation: number;
  id: number;
  genome: string;
  rarity: HoundRarity;
  stats: HoundStats;
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
  const featureIds = genome.substring(0, 5);
  const [base, eyes, mouth, horn] = Array.from(featureIds).map(base62CharToBase10Int);

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

export const Moods: mood[] = ["cool", "angry", "calm", "funky", "tired"];
export const Moons: moon[] = ["sanguine", "blood", "twilight"];
export function houndInfoFromGenome(genome: string): HoundInfo {
  assert(isGenomeValid(genome));
  const featureIds = genome.substring(6, 10);
  const mood = Moods[featureIds.charCodeAt(0) % Moods.length];
  const moon = Moons[featureIds.charCodeAt(1) % Moons.length];

  const config: Config = {
    dictionaries: [colors, animals],
    separator: " ",
    seed: base62ToBase10(featureIds.charCodeAt(2)),
  };

  const spiritAnimal = uniqueNamesGenerator(config);
  const traits = Array.from(featureIds).map((char) => {
    const conf: Config = {
      dictionaries: [adjectives],
      seed: base62CharToBase10Int(char),
    };
    return uniqueNamesGenerator(conf);
  });
  
  const stats: HoundStats = {
    mood,
    moon,
    spiritAnimal,
    traits: traits,
  };

  const nameConfig: Config = {
    dictionaries: [names],
    seed: base62CharToBase10Int(featureIds.charAt(3)),
  };

  const name = uniqueNamesGenerator(nameConfig);

  return {
    stats,
    generation: 0,
    id: Math.floor(2000 + Math.random() * 1000),
    genome,
    rarity: HoundRarity.COMMON,
    name,
  };
}

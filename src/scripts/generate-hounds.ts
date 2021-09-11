import { assert } from "../util/assert";
import { decodeBase62Quadlet, decodeGenome } from "./hound-genome";

async function loadImageFromPath(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = path;
  });
}

const MaxTextureCount = 5;

// Returns a random integer
function randInt(lo: number, hi: number) {
  return Math.floor(lo + Math.random() * hi);
}

// Returns a random element from the array `arr`.
function randChoice<T>(arr: T[]) {
  return arr[randInt(0, arr.length)];
}

const partNames = ["base", "eyes", "mouth", "horn"];

// loads all images whose paths are in the array `paths`.
function loadImages(paths: string[]) {
  return Promise.all(paths.map(loadImageFromPath));
}

// A class that manages loading of resources like images that represent body parts of a hound.
// This is a Singleton class, and must only have one instance.
class AssetLoader {
  private parts: HTMLImageElement[][] | null = null;
  private static numInstances = 0;
  public static instance = new AssetLoader();

  private constructor() {
    ++AssetLoader.numInstances;
    if (AssetLoader.numInstances > 1) {
      throw new Error("AssetLoader is a Singleton");
    }
  }

  async load() {
    if (this.parts) return this.parts;

    this.parts = await Promise.all(
      partNames.map((partName) => {
        const pathPrefix = `/assets/parts/${partName}`;
        const paths: string[] = [];
        for (let i = 1; i <= MaxTextureCount; ++i) {
          paths.push(`${pathPrefix}-${i}.png`);
        }
        return loadImages(paths);
      })
    );

    return this.parts;
  }
}

export async function drawRandomHound(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
): Promise<void> {
  const parts = await AssetLoader.instance.load();

  ctx.clearRect(0, 0, w, h);
  parts.forEach((partImgs) => {
    ctx.drawImage(randChoice(partImgs), 0, 0, w, h);
  });
}

export type CanvasRenderFunc = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

// returns a function that can render hounds on demand
export async function getRandomHoundRenderer(): Promise<CanvasRenderFunc> {
  const parts = await AssetLoader.instance.load();
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    parts.forEach((partImgs) => {
      ctx.drawImage(randChoice(partImgs), 0, 0, w, h);
    });
  };
}

// converts a number decoded from the Genome quadlet into an index that can be used
// to look up the `parts.<body-part>` array.
const MaxQuadLetValue = decodeBase62Quadlet("ZZZZ");
export function genomeNumberToImageIndex(base10Quadlet: number): number {
  assert(base10Quadlet >= 0 && base10Quadlet <= MaxQuadLetValue);
  for (let i = 0; i < MaxTextureCount; ++i) {
    if (
      base10Quadlet >= (i / MaxTextureCount) * MaxQuadLetValue &&
      base10Quadlet < ((i + 1) / MaxTextureCount) * MaxQuadLetValue
    ) {
      return i;
    }
  }
  throw new Error(`Impossible quadlet: ${base10Quadlet}`);
}

export async function getRendererFromGenome(genome: string): Promise<CanvasRenderFunc> {
  const parts = await AssetLoader.instance.load();
  const genomeQuadlets = decodeGenome(genome);

  const partImages: HTMLImageElement[] = [];

  partNames.forEach((name, i) => {
    const partIdx = genomeNumberToImageIndex(genomeQuadlets[name]);
    assert(i >= 0 && i < parts.length);
    assert(partIdx >= 0 && partIdx < parts[i].length);
    partImages.push(parts[i][partIdx]);
  });

  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    partImages.forEach((img) => {
      ctx.drawImage(img, 0, 0, w, h);
    });
  };
}

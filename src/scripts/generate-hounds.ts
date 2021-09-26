import { assert, randChoice } from "./util";
import { decodeBase62Quadlet, decodeGenome } from "./hound-genome";

async function loadImageFromPath(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = path;
  });
}

const MaxTextureCount = 5;
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

export function genomeNumberToImageIndex(featureNumber: number): number {
  assert(featureNumber >= 0 && featureNumber < 62);
  return featureNumber % MaxTextureCount;
}

export async function getRendererFromGenome(genome: string): Promise<CanvasRenderFunc> {
  const parts = await AssetLoader.instance.load();
  const genomeFeatures = decodeGenome(genome);
  console.log(genomeFeatures);

  const partImages: HTMLImageElement[] = [];

  partNames.forEach((name, i) => {
    const partIdx = genomeNumberToImageIndex(genomeFeatures[name]);
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

async function loadImageFromPath(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = path;
  });
}

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

    /// TODO: get rid of the magic number `3`
    this.parts = await Promise.all(
      partNames.map((partName) => {
        const pathPrefix = `./assets/parts/${partName}`;
        const paths = [`${pathPrefix}-1.png`, `${pathPrefix}-2.png`, `${pathPrefix}-3.png`];
        return loadImages(paths);
      })
    );

    return this.parts;
  }
}

export async function drawRandomHound(ctx: CanvasRenderingContext2D, w: number, h: number): Promise<void> {
  const parts = await AssetLoader.instance.load();

  ctx.clearRect(0, 0, w, h);
  parts.forEach((partImgs) => {
    ctx.drawImage(randChoice(partImgs), 0, 0, w, h);
  });
}

type CanvasRenderFunc = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

// returns a function that can render hounds on demand
export async function getHoundRenderer(): Promise<CanvasRenderFunc> {
  const parts = await AssetLoader.instance.load();
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    parts.forEach((partImgs) => {
      ctx.drawImage(randChoice(partImgs), 0, 0, w, h);
    });
  };
}

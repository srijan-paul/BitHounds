const express = require("express");
const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const cors = require("cors");
const sharp = require("sharp");
const pinataSecret = require("./pinata_secret.json");

sharp.cache(false);

const app = express();
const port = 8080;
const pinata = pinataSDK(pinataSecret.apiKey, pinataSecret.secret);
const MaxTextureCount = 5;

function decodeBase62Quadlet(quadlet) {
  const isUpper = (code) => code >= 65 && code <= 90;
  const isLower = (code) => code >= 97 && code <= 122;

  const base62ToBase10 = (code) => {
    if (isLower(code)) return 10 + (code - 97);
    if (isUpper(code)) return 36 + (code - 65);
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

function decodeGenome(genome) {
  const featureIds = genome.substring(0, 5);
  const [base, eyes, mouth, horn] = Array.from(featureIds).map(decodeBase62Quadlet);

  return {
    base,
    eyes,
    mouth,
    horn,
  };
}

function genomeNumberToImageIndex(featureNumber) {
  return featureNumber % MaxTextureCount;
}

const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
  methods: ["POST"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.post("/mint", async (req, res) => {
  const { genome, creator } = req.body;
  try {
    if (!genome) {
      return res.status(400).json({ status: false, msg: "Invalid genome" });
    }

    const partNames = ["base", "eyes", "mouth", "horn"];
    const genomeFeatures = decodeGenome(genome);
    const images = [];
    partNames.forEach((name) => {
      const partIdx = genomeNumberToImageIndex(genomeFeatures[name]) + 1;
      images.push(`../public/assets/parts/${name}-${partIdx}.png`);
    });

    await sharp(images[0])
      .composite([{ input: images[1] }])
      .toFile("part1.png");

    await sharp(images[2])
      .composite([{ input: images[3] }])
      .toFile("part2.png");

    await sharp("part1.png")
      .composite([{ input: "part2.png" }])
      .toFile("output.png");

    usePinata(creator, res);
  } catch (e) {
    console.error(e);
    res.statusEnd(500);
  }
});

async function usePinata(creator, res) {
  const fileName = "output.png";
  await pinata.testAuthentication().catch((err) => res.status(500).json(JSON.stringify(err)));
  const readableStreamForFile = fs.createReadStream(`${fileName}`);
  const options = {
    pinataMetadata: {
      name: "Houd NFT",
      keyvalues: {
        description: "Image of Hound",
      },
    },
  };

  const pinnedFile = await pinata.pinFileToIPFS(readableStreamForFile, options);

  if (!pinnedFile.IpfsHash || pinnedFile.PinSize <= 0)
    return res.status(500).json({ status: false, msg: "file was not pinned" });

  fs.unlinkSync(`${fileName}`);
  const metadata = {
    name: "Hound NFT",
    description: "Playable Trading Cards",
    symbol: "Hound NFT",
    artifactUri: `ipfs://${pinnedFile.IpfsHash}`,
    displayUri: `ipfs://${pinnedFile.IpfsHash}`,
    creators: [creator],
    decimals: 0,
    thumbnailUri: `ipfs://${pinnedFile.IpfsHash}`,
    is_transferable: true,
    shouldPreferSymbol: false,
  };

  const pinnedMetadata = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: {
      name: "NFT-Metadata",
    },
  });

  if (pinnedMetadata.IpfsHash && pinnedMetadata.PinSize > 0) {
    return res.status(200).json({
      status: true,
      msg: {
        imageHash: pinnedFile.IpfsHash,
        metadataHash: pinnedMetadata.IpfsHash,
      },
    });
  }

  res.status(500).json({ status: false, msg: "metadata were not pinned" });
}

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

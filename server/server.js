import express from "express";
import pinataSDK from "@pinata/sdk";
import fs from "fs";
import cors from "cors";
import sharp from "sharp";
sharp.cache(false);

const app = express();
const port = 8080;
const pinata = pinataSDK("84804ab6ad3f0690267e", "5965f50ef481aa3972c6202d6b1ef572ec06b293b8e121fc1a838ae85c9d8d26");
const MaxTextureCount = 5;

function decodeBase62Quadlet(quadlet){
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
  methods: ["POST"]
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.post("/mint", async (req, res) => {
  try {
    const genome = req.query.genome;
    if (!genome) {
      res.status(500).json({ status: false, msg: "no file provided" });
    } else {
      const partNames = ["base", "eyes", "mouth", "horn"];
      const genomeFeatures = decodeGenome(genome);
      const images = [];
      partNames.forEach((name) => {
        const partIdx = genomeNumberToImageIndex(genomeFeatures[name]) + 1;
        images.push(`../public/assets/parts/${name}-${partIdx}.png`);
      });
      sharp(images[0])
        .composite([{ 
          input: images[1]
        }])
        .toFile("part1.png", function(err) {
          console.log("error: ", err);
          sharp(images[2])
            .composite([{ 
              input: images[3]
            }])
            .toFile("part2.png", function(err) {
              console.log("error: ", err);
              sharp("part1.png")
                .composite([{ 
                  input: "part2.png"
                }])
                .toFile("output.png", function(err) {
                  console.log("error: ", err);
                  usePinata(req,res);
                });
            });
        });
    }
  } catch(e) {
    console.log(e);
  }
});

async function usePinata(req,res) {
  const fileName = "output.png";
  await pinata
    .testAuthentication()
    .catch((err) => res.status(500).json(JSON.stringify(err)));
  const readableStreamForFile = fs.createReadStream(`${fileName}`);
  const options= {
    pinataMetadata: {
      name: "Houd NFT",
      keyvalues: {
        description: "Image of Hound"
      }
    }
  };
  const pinnedFile = await pinata.pinFileToIPFS(
    readableStreamForFile,
    options
  );
  if (pinnedFile.IpfsHash && pinnedFile.PinSize > 0) {
    fs.unlinkSync(`${fileName}`);
    const metadata = {
      name: "Hound NFT",
      description: "Playable Trading Cards",
      symbol: "Hound NFT",
      artifactUri: `ipfs://${pinnedFile.IpfsHash}`,
      displayUri: `ipfs://${pinnedFile.IpfsHash}`,
      creators: [req.query.creator],
      decimals: 0,
      thumbnailUri: `ipfs://${pinnedFile.IpfsHash}`,
      is_transferable: true,
      shouldPreferSymbol: false
    };

    const pinnedMetadata = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: "NFT-Metadata"
      }
    });

    if (pinnedMetadata.IpfsHash && pinnedMetadata.PinSize > 0) {
      res.status(200).json({
        status: true,
        msg: {
          imageHash: pinnedFile.IpfsHash,
          metadataHash: pinnedMetadata.IpfsHash
        }
      });
    } else {
      res
        .status(500)
        .json({ status: false, msg: "metadata were not pinned" });
    }
  } else {
    res.status(500).json({ status: false, msg: "file was not pinned" });
  }
}
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

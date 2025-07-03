import wallet from "../../Turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image =
      "https://gateway.irys.xyz/BsPQmxdQ5hyDJHVeKuzoQTmqT7FwjDF1q1J2NuiKrbs";
    const metadata = {
      name: "Jeff's Precious Rug",
      symbol: "JPR",
      description: "Jeff can't do without this rug",
      image,
      attributes: [{ trait_type: "charm", value: "hair growth" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image
          }
        ]
      },
      creators: []
    };
    const myUri = await umi.uploader.uploadJson(metadata); // https://gateway.irys.xyz/6uRu1aQeMd5KQ9T3KFYT6yFMVbEDouzSFpiDikWjw93E
    console.log("Your metadata URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();

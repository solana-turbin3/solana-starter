import wallet from "../../Turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    const file = await readFile(
      "/home/inspiraion/Documents/turbine/solana-starter/ts/cluster1/generug_.png"
    );
    //2. Convert image to generic file.
    const converted_file = createGenericFile(file, "gen_rug.png", {
      contentType: "img/png"
    });
    //3. Upload image
    const [my_uri] = await umi.uploader.upload([converted_file]);
    console.log("my image uri: ", my_uri); // https://gateway.irys.xyz/BsPQmxdQ5hyDJHVeKuzoQTmqT7FwjDF1q1J2NuiKrbs

    // const image = ???

    // const [myUri] = ???
    // console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();

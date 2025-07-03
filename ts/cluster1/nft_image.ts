// import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"
import { readFileSync } from "fs"
import { getKeypairFromFile } from "@solana-developers/helpers"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');


(async () => {
    try {
        let wallet=await getKeypairFromFile()
        let keypair = umi.eddsa.createKeypairFromSecretKey(wallet.secretKey);
        const signer = createSignerFromKeypair(umi, keypair);
        
        umi.use(irysUploader());
        umi.use(signerIdentity(signer));
        
        //1. Load imagec
        //2. Convert image to generic file.
        //3. Upload image
        const fileImg=readFileSync('./chowchow.jpg');
        const genericFile=await createGenericFile(fileImg,'chowchow',{
            contentType:'image/jpeg'
        })

        const [image] =await umi.uploader.upload([genericFile]) 

        // const [myUri] = ??? 
        console.log("Your image URI: ", image);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

// import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { getKeypairFromFile } from "@solana-developers/helpers";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');


(async () => {
    try {
        // Follow this JSON structure
        let wallet=await getKeypairFromFile()
        let keypair = umi.eddsa.createKeypairFromSecretKey(wallet.secretKey);
        const signer = createSignerFromKeypair(umi, keypair);
        
        umi.use(irysUploader());
        umi.use(signerIdentity(signer));
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = " https://gateway.irys.xyz/5oFW2BykSReesNCxzm4W6YJLEKjpxfTL5fjDLwR9UYVS"
        const metadata = {
            name: "ChowChow",
            symbol: "CHW",
            description: "Only chowchow",
            image: image,
            attributes: [
                {trait_type: "breed", value: 'chowchow'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata)
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

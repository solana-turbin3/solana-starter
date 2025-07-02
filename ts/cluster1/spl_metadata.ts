// import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey, percentAmount, createGenericFile } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { getKeypairFromEnvironment, getKeypairFromFile } from "@solana-developers/helpers";
import { readFileSync } from "fs";
import { couldStartTrivia } from "typescript";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Define our Mint address

// Create a UMI connection

(async () => {
    try {
        const mint = publicKey("C1TspBu869ZUgQv8KFsXnqaGdsViYydr7S3wyzTJxHwG")
        const umi = createUmi('https://api.devnet.solana.com');
        const keypair1= await getKeypairFromFile()
        
        const keypair = umi.eddsa.createKeypairFromSecretKey(keypair1.secretKey);
        const signer = createSignerFromKeypair(umi, keypair);
        umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));
        umi.use(irysUploader())
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint:mint,
            mintAuthority:signer,
        }

        const imagefile=readFileSync('./dragonite.jpg')
        const genericfile=createGenericFile(imagefile,'dragonite.jpg',{
            contentType:"image/jpeg"
        });

        const imgumi=await umi.uploader.upload([genericfile])
        console.log(`image url is ${imgumi}`)
        const metadataui=await umi.uploader.uploadJson({
        name:"Tokenite",
        description:"cute little dragonite",
        image:imgumi[0],
        external_uri:"https://example.com",
        properties:{
            files:[
                {
                    uri:imgumi,
                    type:"image/jpeg"
                }
            ],
            category:"image"
        }
        })
        console.log(`metadata uri is ${metadataui}`)
        let data: DataV2Args = {
            name:"Tokenite",
            symbol:"DGT",
            sellerFeeBasisPoints:0.5,
            uri:metadataui,
            collection:null,
            creators:null,
            uses:null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            collectionDetails:null,
            data:data,
            isMutable:true
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

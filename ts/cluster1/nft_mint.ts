import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

// import wallet from "../turbin3-wallet.json"
import base58 from "bs58";
import { getKeypairFromFile } from "@solana-developers/helpers";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

(async () => {
    let wallet=await getKeypairFromFile()
    let keypair = umi.eddsa.createKeypairFromSecretKey(wallet.secretKey);
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner));
    umi.use(mplTokenMetadata())
    
    const mint = generateSigner(umi);
    
    const metadata="https://gateway.irys.xyz/AABuktxr4psAmj8MwpcRy8H63aPmm4vi79bwuG9nDmc2"
    let tx =await createNft(umi,{
        mint:mint,
        name:"ChowChow",
        symbol:"CHW",
        sellerFeeBasisPoints:percentAmount(0),
        uri:metadata,
        authority:myKeypairSigner,
        decimals:1,
    }) 
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();
import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import { getKeypairFromFile } from "@solana-developers/helpers";
// import wallet from "../turbin3-wallet.json"

// Import our keypair from the wallet file
// const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        const keypair=await getKeypairFromFile();

        // Start here
        const mint = await createMint(connection,keypair,keypair.publicKey,null,6)
        console.log(`the asked mint is ${mint}`)
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
//C1TspBu869ZUgQv8KFsXnqaGdsViYydr7S3wyzTJxHwG
import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
// import wallet from "../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { getKeypairFromFile } from "@solana-developers/helpers";

// We're going to import our keypair from the wallet file

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("C1TspBu869ZUgQv8KFsXnqaGdsViYydr7S3wyzTJxHwG");

// Recipient address
const to = new PublicKey("deiyvXCabxck1UYaAWH4PT5mTPGhhkmLRcFhRGdWBJq");

(async () => {
    const keypair = await  getKeypairFromFile();
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const atafrom=await getOrCreateAssociatedTokenAccount(connection,keypair,mint,keypair.publicKey)
        // Get the token account of the toWallet address, and if it does not exist, create it
        const atato=await getOrCreateAssociatedTokenAccount(connection,keypair,mint,to)
        // Transfer the new token to the "toTokenAccount" we just created
        const txid=await transfer(connection,keypair,atafrom.address,atato.address,keypair,100000)
        console.log("tx id is",txid);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey
} from "@solana/web3.js";
import wallet from "../../Turbin3-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("6cTJecpGc2eK5iGLxKupb9Qz38UivMeHsjHrSbfFUQbA");

// Recipient address
const to = new PublicKey("9RfzL2S74r8BGuaCFJKoKTr8VEXohcCzFq7RTkfwsVbf");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const senderAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const receiverAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );

    // Transfer the new token to the "toTokenAccount" we just created
    const tx = await transfer(
      connection,
      keypair,
      senderAta.address,
      receiverAta.address,
      keypair.publicKey,
      4_000_000
    );

    console.log("===== tx ===== ");
    console.log(tx);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

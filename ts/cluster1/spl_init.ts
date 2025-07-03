import {
  Keypair,
  Connection,
  Commitment,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import wallet from "../../Turbin3-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
  try {
    // Start here
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      keypair.publicKey,
      6
    );

    console.log("===== mint ===== ");
    console.log(mint); // 6cTJecpGc2eK5iGLxKupb9Qz38UivMeHsjHrSbfFUQbA
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();

const { Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const { CONNECTION, PAYER } = require("../const");

(async () => {
  // Generate a new wallet keypair and airdrop SOL
  var fromWallet = Keypair.generate();
  var fromAirdropSignature = await CONNECTION.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL,
  );
  //wait for airdrop confirmation
  await connection.confirmTransaction(fromAirdropSignature);

  // Generate a new wallet to receive newly minted token
  var toWallet = Keypair.generate();

  //create new token mint
  let mint = await splToken.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9,
    splToken.TOKEN_PROGRAM_ID,
  );

  //get the token account of the fromWallet Solana address, if it does not exist, create it
  let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey,
  );

  //get the token account of the toWallet Solana address, if it does not exist, create it
  var toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    toWallet.publicKey,
  );

  //minting 1 new token to the "fromTokenAccount" account we just returned/created
  await mint.mintTo(
    fromTokenAccount.address,
    fromWallet.publicKey,
    [],
    1000000000,
  );

  // Add token transfer instructions to transaction
  var transaction = new Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      1,
    ),
  );

  // Sign transaction, broadcast, and confirm
  var signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet],
    {commitment: 'confirmed'},
  );
  console.log('SIGNATURE', signature);
})();
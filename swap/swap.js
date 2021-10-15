const { Keypair, Transaction, SystemProgram, PublicKey } = require("@solana/web3.js");
const { MintLayout, AccountLayout, Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { TokenSwap } = require('@solana/spl-token-swap')
const BN = require('bn.js')
const { CONNECTION, PAYER, TEST_OWNER } = require("../const");
// const { TOKEN_SWAP_PROGRAM_ID } = require('../programIds');

const swap = async () => {
  const TOKEN_SWAP_PROGRAM_ID = new PublicKey('EvRyQnGyXsGaMtygBz2ieLHYyxSZc9uXWossPa7sgMDT')
  const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
    CONNECTION,
    new PublicKey('6hpEd3x5s5HwtNA3CS5KUboMRRNKPrwRPx6DFY4cLBHp'),
    TOKEN_SWAP_PROGRAM_ID,
    PAYER, // what ever account?
  );
  console.log({fetchedTokenSwap})

  const transaction = new Transaction();
  const userAccountA = new PublicKey('EGPDdup5xNYtawCxYvHj1XTzhNSQVSx5JRXPyh948t6U')
  const userAccountB = new PublicKey('5qCwwpBd2WtFJLRtFx7EN7kHL9cVWk5sBoUhZV4XudC2')
  const swapAmount = 100
  const userTransferAuthority = Keypair.generate();
  transaction.add(
    Token.createApproveInstruction(
      TOKEN_PROGRAM_ID, // token program Id
      userAccountA, // who authorize
      userTransferAuthority.publicKey, // who is delegated
      TEST_OWNER.publicKey,
      [TEST_OWNER],
      swapAmount,
    ),
  );
  console.log('asdadasdasd', TEST_OWNER.publicKey);

  transaction.add(
    TokenSwap.swapInstruction(
      fetchedTokenSwap.tokenSwap, // tokenSwapAccount publicKey
      fetchedTokenSwap.authority,
      userTransferAuthority.publicKey,
      userAccountA,
      fetchedTokenSwap.tokenAccountA,
      fetchedTokenSwap.tokenAccountB,
      userAccountB, // user destination tokenB account, should be user's ATA
      fetchedTokenSwap.poolToken, // poolTokenMint
      fetchedTokenSwap.feeAccount,
      fetchedTokenSwap.feeAccount,
      TOKEN_SWAP_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      swapAmount,
      0,
    ),
  );
  console.log('1231244322');

  // let txHash = await CONNECTION.sendTransaction(transaction, [
  //   TEST_OWNER,
  //   userTransferAuthority,
  // ]);
  // console.log({txHash});
  // return txHash;
}

swap().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);

module.exports = swap

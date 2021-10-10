const { Keypair, Transaction, SystemProgram } = require("@solana/web3.js");
const { CONNECTION, PAYER, TEST_OWNER } = require("../const");
const { TOKEN_SWAP_PROGRAM_ID } = require('../programIds')

async function main() {
  let random = Keypair.generate();
  console.log(`to: ${random.publicKey}`);

  let tx = new Transaction();
  // add transfer instruction
  tx.add(
    // 創建一個帳戶
    SystemProgram.createAccount({
      fromPubkey: PAYER.publicKey, // 要送sol的帳號
      newAccountPubkey: random.publicKey, // account的publicKey
      space: 324,
      lamports: 3145920,
      programId: TOKEN_SWAP_PROGRAM_ID,
    }),
    // SystemProgram.transfer({
    //   fromPubkey: random.publicKey,
    //   toPubkey: PAYER.publicKey,
    //   lamports: 3145920, // 0.1 SOL
    // })
  );
  // specify feePayer
  tx.feePayer = PAYER.publicKey;

  // 發送交易 (後面的array是帶入要簽名的帳戶，我們建立的這個交易需要from跟feePayer都簽名，如果from跟feePayer都是同一個人，那就只需要帶入feePayer即可)
  let txhash = await CONNECTION.sendTransaction(tx, [PAYER]);
  console.log(`txhash: ${txhash}`);
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
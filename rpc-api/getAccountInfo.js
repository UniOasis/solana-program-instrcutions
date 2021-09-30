const { PublicKey } = require("@solana/web3.js");
const { CONNECTION, PAYER, TEST_OWNER } = require("../const");

// 查詢帳戶資訊和餘額

async function main() {
  const account = await CONNECTION.getAccountInfo(PAYER.publicKey);
  console.log('payer: ', account);
  const ownerAccount = await CONNECTION.getAccountInfo(TEST_OWNER.publicKey);
  console.log('owner: ', ownerAccount);

  const wrappedAccount = await CONNECTION.getAccountInfo(new PublicKey('HVdJu8YL2qaQc4uEeYHJC1fn5gSiVhEK3SAvgBgQkTtG'));
  console.log(wrappedAccount);
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
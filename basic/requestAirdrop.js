const { CONNECTION, PAYER, TEST_OWNER } = require("../const");

// 拿一些Solana的測試幣

async function main() {
  // 拿測試幣
  let txhash1 = await CONNECTION.requestAirdrop(PAYER.publicKey, 1e10);
  let txhash2 = await CONNECTION.requestAirdrop(TEST_OWNER.publicKey, 1e10);

  // 可以在 https://explorer.solana.com 查詢這筆交易，記得要選擇到你測試的網路
  console.log(`txhash: ${txhash1} ${txhash2}`);
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
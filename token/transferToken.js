import { Transaction } from "@solana/web3.js";

import { CONNECTION, PAYER, TOKEN_ADDRESS_1, TOKEN_ADDRESS_2, TEST_OWNER } from "../../../helper/const";

import * as SPLToken from "@solana/spl-token";

// Token轉帳

async function main() {
  let tx = new Transaction();
  tx.add(
    SPLToken.Token.createTransferInstruction(
      SPLToken.TOKEN_PROGRAM_ID, // 通常是固定數值, token program address
      TOKEN_ADDRESS_1, // from (token account public key)
      TOKEN_ADDRESS_2, // to (token account public key)
      TEST_OWNER.publicKey, // from的auth
      [], // from是mutiple signers才需要帶，這邊我們留空
      10 // 轉帳的數量，這邊是最小單位，要注意decimals與實際數值的換算
    )
  );
  tx.feePayer = PAYER.publicKey;

  console.log(`txhash: ${await CONNECTION.sendTransaction(tx, [TEST_OWNER, PAYER])}`);
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
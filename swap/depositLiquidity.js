const { Keypair, Transaction, SystemProgram, PublicKey } = require("@solana/web3.js");
const { MintLayout, AccountLayout, Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { TokenSwap } = require('@solana/spl-token-swap')
const BN = require('bn.js')
const { CONNECTION, PAYER, TEST_OWNER } = require("../const");
const { TOKEN_SWAP_PROGRAM_ID } = require('../programIds');

const depositLiquidity = async () => {

}

depositLiquidity().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);


module.exports = depositLiquidity

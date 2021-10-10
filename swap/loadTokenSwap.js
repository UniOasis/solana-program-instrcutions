const { Keypair, Transaction, SystemProgram, PublicKey } = require("@solana/web3.js");
const { MintLayout, AccountLayout, Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { TokenSwap } = require('@solana/spl-token-swap')
const BN = require('bn.js')
const { CONNECTION, PAYER, TEST_OWNER } = require("../const");
// const { TOKEN_SWAP_PROGRAM_ID } = require('../programIds');

const SWAP_PROGRAM_OWNER_FEE_ADDRESS = new PublicKey('EHqmfkN89RJ7Y33CXM6uCzhVeuywHoJXZZLszBHHZy7o');

// self-built swap program Id: EvRyQnGyXsGaMtygBz2ieLHYyxSZc9uXWossPa7sgMDT
const TOKEN_SWAP_PROGRAM_ID = new PublicKey('EvRyQnGyXsGaMtygBz2ieLHYyxSZc9uXWossPa7sgMDT')

const loadTokenSwap = async () => {
  console.log('loading token swap');
  const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
    CONNECTION,
    new PublicKey('6hpEd3x5s5HwtNA3CS5KUboMRRNKPrwRPx6DFY4cLBHp'),
    TOKEN_SWAP_PROGRAM_ID,
    TEST_OWNER, // what ever account?
  );
  console.log({fetchedTokenSwap})
}

loadTokenSwap().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);


module.exports = loadTokenSwap

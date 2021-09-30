const { Keypair, Transaction, SystemProgram, PublicKey } = require("@solana/web3.js");
const { MintLayout, AccountLayout, Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const BN = require('bn.js')
const { CONNECTION, PAYER, TEST_OWNER } = require("../const");
const { TOKEN_SWAP_PROGRAM_ID } = require('../programIds');

// The following globals are created by `createTokenSwap` and used by subsequent tests
// Token swap
let tokenSwap;
// authority of the token and accounts
let authority;
// bump seed used to generate the authority public key
let bumpSeed;
// owner of the user accounts
let owner;
// Token pool
let tokenPool;
let tokenAccountPool;
let feeAccount;
// Tokens swapped
let mintA;
let mintB;
let tokenAccountA;
let tokenAccountB;

const SWAP_PROGRAM_OWNER_FEE_ADDRESS = new PublicKey('2hieMSXcsk3F3bZE8iDe7WGREZesRDnDjHtdPVjya4NA');

// Pool fees
const TRADING_FEE_NUMERATOR = 25;
const TRADING_FEE_DENOMINATOR = 10000;
const OWNER_TRADING_FEE_NUMERATOR = 5;
const OWNER_TRADING_FEE_DENOMINATOR = 10000;
const OWNER_WITHDRAW_FEE_NUMERATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 0 : 1;
const OWNER_WITHDRAW_FEE_DENOMINATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 0 : 6;
const HOST_FEE_NUMERATOR = 20;
const HOST_FEE_DENOMINATOR = 100;

// Initial amount in each swap token
let currentSwapTokenA = 1000000;
let currentSwapTokenB = 1000000;
let currentFeeAmount = 0;

// Pool token amount minted on init
const DEFAULT_POOL_TOKEN_AMOUNT = 1000000000;
// Pool token amount to withdraw / deposit
const POOL_TOKEN_AMOUNT = 10000000;

const createSwap = async () => {
  const tokenSwapAccount = Keypair.generate()
  
  [authority, bumpSeed] = await PublicKey.findProgramAddress(
    [tokenSwapAccount.publicKey.toBuffer()],
    TOKEN_SWAP_PROGRAM_ID,
  );

  // create token pool mint
  tokenPool = await Token.createMint(
    CONNECTION,
    PAYER,
    authority,
    null,
    2,
    TOKEN_PROGRAM_ID,
  );
}


module.exports = createSwap

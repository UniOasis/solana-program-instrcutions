const { Keypair, Transaction, SystemProgram, PublicKey } = require("@solana/web3.js");
const { MintLayout, AccountLayout, Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { TokenSwap } = require('@solana/spl-token-swap')
const BN = require('bn.js')
const { CONNECTION, PAYER, TEST_OWNER } = require("../const");
const { TOKEN_SWAP_PROGRAM_ID } = require('../programIds');
const createMintAndVault = require('../token/createMintAndVault')

// The following globals are created by `createTokenSwap` and used by subsequent tests
// Token swap
// let tokenSwap;
// authority of the token and accounts
// let authority;
// // bump seed used to generate the authority public key
// let bumpSeed;
// owner of the user accounts
// let owner;
// Token pool
// let tokenPool;
// let tokenAccountPool;
// let feeAccount;
// Tokens swapped
// let mintA;
// let mintB;
// let tokenAccountA;
// let tokenAccountB;

const SWAP_PROGRAM_OWNER_FEE_ADDRESS = new PublicKey('EHqmfkN89RJ7Y33CXM6uCzhVeuywHoJXZZLszBHHZy7o');

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
  console.log({tokenSwapAccount: tokenSwapAccount.publicKey.toBase58()})
  console.log({tokenSwapAccount: tokenSwapAccount.publicKey.toBuffer()})
  console.log({TOKEN_SWAP_PROGRAM_ID})
  
  let [authority, bumpSeed] = await PublicKey.findProgramAddress(
    [tokenSwapAccount.publicKey.toBuffer()],
    TOKEN_SWAP_PROGRAM_ID,
  );
  console.log({authority})

  // create token pool mint
  const tokenPool = await Token.createMint(
    CONNECTION,
    PAYER,
    authority,
    null,
    2,
    TOKEN_PROGRAM_ID,
  );
  // console.log({tokenPool})

  const tokenAccountPool = await tokenPool.createAccount(SWAP_PROGRAM_OWNER_FEE_ADDRESS);
  console.log({tokenAccountPool})
  // const ownerKey = SWAP_PROGRAM_OWNER_FEE_ADDRESS || owner.publicKey.toString();
  const feeAccount = await tokenPool.createAccount(SWAP_PROGRAM_OWNER_FEE_ADDRESS);
  console.log({feeAccount})

  // create mintA token
  const [mintA, tokenAccountA] = await createMintAndVault(authority)
  console.log({mintA, tokenAccountA})

  // create mintB token
  const [mintB, tokenAccountB] = await createMintAndVault(authority)
  console.log({mintB, tokenAccountB})


  const tokenSwap = await TokenSwap.createTokenSwap(
    CONNECTION,
    PAYER,
    tokenSwapAccount, // tokenSwapAccount publicKey
    authority, // PDA publicKey
    tokenAccountA, // tokenAccountA publicKey
    tokenAccountB, // tokenAccountB publicKey
    tokenPool.publicKey, // tokenPoolMint publicKey
    mintA.publicKey, // mintA publicKey
    mintB.publicKey, // mintB publicKey
    tokenAccountPool, // feeAccount publicKey
    tokenAccountPool, // tokenPool Account publicKey
    TOKEN_SWAP_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    TRADING_FEE_NUMERATOR,
    TRADING_FEE_DENOMINATOR,
    OWNER_TRADING_FEE_NUMERATOR,
    OWNER_TRADING_FEE_DENOMINATOR,
    OWNER_WITHDRAW_FEE_NUMERATOR,
    OWNER_WITHDRAW_FEE_DENOMINATOR,
    HOST_FEE_NUMERATOR,
    HOST_FEE_DENOMINATOR,
    0, // curveType
  );
  console.log({tokenSwap})

  console.log('loading token swap');
  const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
    CONNECTION,
    tokenSwapAccount.publicKey,
    TOKEN_SWAP_PROGRAM_ID,
    PAYER,
  );
  console.log({fetchedTokenSwap})
}

// (async function() {
//   await createSwap()
// }())
createSwap().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);


module.exports = createSwap

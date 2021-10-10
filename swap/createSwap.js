const { Keypair, Transaction, SystemProgram, PublicKey } = require("@solana/web3.js");
const { MintLayout, AccountLayout, Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { TokenSwap } = require('@solana/spl-token-swap')
const BN = require('bn.js')
const { CONNECTION, PAYER, TEST_OWNER } = require("../const");
// const { TOKEN_SWAP_PROGRAM_ID } = require('../programIds');
const createMintAndVault = require('../token/createMintAndVault')

const SWAP_PROGRAM_OWNER_FEE_ADDRESS = new PublicKey('EHqmfkN89RJ7Y33CXM6uCzhVeuywHoJXZZLszBHHZy7o');

// The following globals are created by `createTokenSwap` and used by subsequent tests
// Token swap
let tokenSwap;
// authority of the token and accounts
let authority;
// // bump seed used to generate the authority public key
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

const delay = (delay) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

// self-built swap program Id: EvRyQnGyXsGaMtygBz2ieLHYyxSZc9uXWossPa7sgMDT
const TOKEN_SWAP_PROGRAM_ID = new PublicKey('EvRyQnGyXsGaMtygBz2ieLHYyxSZc9uXWossPa7sgMDT')

const createSwap = async () => {
  const tokenSwapAccount = Keypair.generate()
  console.log({tokenSwapAccount: tokenSwapAccount.publicKey.toBase58()})
  console.log({TOKEN_SWAP_PROGRAM_ID})
  
  let [authority, bumpSeed] = await PublicKey.findProgramAddress(
    [tokenSwapAccount.publicKey.toBuffer()],
    TOKEN_SWAP_PROGRAM_ID,
  );
  console.log({authority: authority.toBase58(), bumpSeed})

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

  const tokenAccountPool = await tokenPool.createAccount(TEST_OWNER.publicKey);
  console.log({tokenAccountPool: tokenAccountPool.toBase58()})
  // const ownerKey = SWAP_PROGRAM_OWNER_FEE_ADDRESS || owner.publicKey.toString();
  const feeAccount = await tokenPool.createAccount(TEST_OWNER.publicKey);
  console.log({feeAccount: feeAccount.toBase58()})

  await delay(1000)

  // // create mintA token
  // const [mintA, tokenAccountA] = await createMintAndVault(authority)
  // console.log({mintA, tokenAccountA})

  // // create mintB token
  // const [mintB, tokenAccountB] = await createMintAndVault(authority)
  // console.log({mintB, tokenAccountB})

  console.log('creating token A');
  mintA = await Token.createMint(
    CONNECTION,
    PAYER,
    TEST_OWNER.publicKey,
    null,
    2,
    TOKEN_PROGRAM_ID,
  );
  console.log({mintA: mintA.publicKey.toBase58()})

  console.log('creating token A account');
  tokenAccountA = await mintA.createAccount(authority);
  console.log('minting token A to swap');
  await mintA.mintTo(tokenAccountA, TEST_OWNER, [], currentSwapTokenA);

  await delay(1000)
  console.log('creating token B');
  mintB = await Token.createMint(
    CONNECTION,
    PAYER,
    TEST_OWNER.publicKey,
    null,
    2,
    TOKEN_PROGRAM_ID,
  );
  console.log({mintB: mintB.publicKey.toBase58()})

  console.log('creating token B account');
  tokenAccountB = await mintB.createAccount(authority);
  console.log('minting token B to swap');
  await mintB.mintTo(tokenAccountB, TEST_OWNER, [], currentSwapTokenB);

  await delay(1000)
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
    feeAccount, // feeAccount publicKey
    tokenAccountPool, // tokenPool Account publicKey
    TOKEN_SWAP_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    bumpSeed,
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

const depositLiquidity = async () => {
  console.log('loading token swap');
  const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
    CONNECTION,
    new PublicKey('6hpEd3x5s5HwtNA3CS5KUboMRRNKPrwRPx6DFY4cLBHp'),
    TOKEN_SWAP_PROGRAM_ID,
    PAYER,
  );
  console.log({fetchedTokenSwap})

  const poolMintInfo = await tokenPool.getMintInfo();
  console.log({poolMintInfo})
  const supply = poolMintInfo.supply.toNumber();
  console.log({supply})
  const swapTokenA = await mintA.getAccountInfo(tokenAccountA);
  const tokenA = Math.floor(
    (swapTokenA.amount.toNumber() * POOL_TOKEN_AMOUNT) / supply,
  );
  console.log({tokenA})
  const swapTokenB = await mintB.getAccountInfo(tokenAccountB);
  const tokenB = Math.floor(
    (swapTokenB.amount.toNumber() * POOL_TOKEN_AMOUNT) / supply,
  );

  // const userTransferAuthority = new Account();
  const userTransferAuthority = Keypair.generate();
  console.log('Creating depositor token a account');
  // const userAccountA = await mintA.createAccount(owner.publicKey);
  const userAccountA = await mintA.createAccount(TEST_OWNER.publicKey);
  await mintA.mintTo(userAccountA, TEST_OWNER, [], tokenA+10000);
  await mintA.approve(
    userAccountA,
    userTransferAuthority.publicKey,
    TEST_OWNER,
    [],
    tokenA,
  );
  console.log('Creating depositor token b account');
  const userAccountB = await mintB.createAccount(TEST_OWNER.publicKey);
  await mintB.mintTo(userAccountB, TEST_OWNER, [], tokenB+10000);
  await mintB.approve(
    userAccountB,
    userTransferAuthority.publicKey,
    TEST_OWNER,
    [],
    tokenB,
  );
  console.log('Creating depositor pool token account');
  const newAccountPool = await tokenPool.createAccount(TEST_OWNER.publicKey);

  console.log('Depositing into swap');
  await tokenSwap.depositAllTokenTypes(
    userAccountA,
    userAccountB,
    newAccountPool,
    userTransferAuthority,
    POOL_TOKEN_AMOUNT,
    tokenA,
    tokenB,
  );
}

const createSwapAndAddLiquidity = async () => {
  await createSwap()
  await depositLiquidity()
}

createSwap().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);


module.exports = {
  createSwap,
  depositLiquidity,
  createSwapAndAddLiquidity
}

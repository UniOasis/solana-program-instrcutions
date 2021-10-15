const { PublicKey, Connection } = require("@solana/web3.js");
const {Utils} = require('@metaplex/js')
const { METADATA_PROGRAM_ID } = require("../programIds");

/**
 * seeds: (Buffer | Uint8Array)[],
 * programId: PublicKey,
 */

async function main() {
  const programs = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      METADATA_PROGRAM_ID.toBuffer(),
      new PublicKey('6Js5N4YffZc8PoJ6qm1o1MuCxCsUxU3w8RYcwsKnQMXz').toBuffer(),
    ],
    METADATA_PROGRAM_ID,
  );
  const PDA = programs[0].toBase58()
  console.log({ programs: PDA })

  // const programs_metaplex = await PublicKey.findProgramAddress(
  //   [
  //     Buffer.from('metaplex'),
  //     METADATA_PROGRAM_ID.toBuffer(),
  //     new PublicKey('6Js5N4YffZc8PoJ6qm1o1MuCxCsUxU3w8RYcwsKnQMXz').toBuffer(),
  //   ],
  //   METADATA_PROGRAM_ID,
  // );

  const API_ENDPOINT = "https://solana-api.projectserum.com"
  const connection = new Connection(API_ENDPOINT);

  const accountData = await connection.getAccountInfo(new PublicKey(PDA));
  console.log({accountData: accountData.data})
  const json = Utils.Borsh.Data.deserialize(accountData.data)
  console.log({json})
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);



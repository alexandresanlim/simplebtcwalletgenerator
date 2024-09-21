const bip32 = require("bip32");
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");

//Select network:
//testnet: using for bitcoin test network
//bitcoin: using for bitcoin main network
//complete doc: https://bitcoinjs.github.io/bitcoinjs-lib/modules/networks.html
const network = bitcoin.networks.testnet;

//Set derivation HD wallet path
//using 1 for testnet and 0 for mainnet on `m/49'/{here}'/0'/0`
const path = `m/49'/1'/0'/0`;

const mnemonic = bip39.generateMnemonic();

const mnemonicIsValid = bip39.validateMnemonic(mnemonic);

if (!mnemonicIsValid) {
  console.log("⚠️ MNEMONIC IS NOT VALID ⚠️");
  return;
}

const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = bip32.fromSeed(seed, network);

const account = root.derivePath(path);
const node = account.derive(0).derive(0);

const payment = {
  pubKey: node.publicKey,
  network: node.network,
};

//Create pay to public key hash
const btcaddress = bitcoin.payments.p2pkh({
  pubkey: payment.pubKey,
  network: payment.network,
}).address;

console.log("=============================");
console.log("Wallet was generated! 🎉");
console.log("📧 ADDRESS:", btcaddress);
console.log("🔒 WIF:", node.toWIF());
console.log("🌾 SEED:", mnemonic);
console.log("=============================");

import EthCrypto from 'eth-crypto';
import { keccak256 } from "ethereum-cryptography/keccak";
import { ripemd160 } from "ethereum-cryptography/ripemd160";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { sha256 } from "ethereum-cryptography/sha256";
import { bytesToHex, hexToBytes } from "ethereum-cryptography/utils";
import { HDNodeWallet } from 'ethers';

/**
 * Convert Ethereum public key to Ethereum address
 * @param publicKey - Ethereum public key. Accepts both compressed and uncompressed public keys.
 * @returns Ethereum address
 */
export function publicKeyToEthereumAddress(publicKey: string): string {
  // Remove '0x' prefix
  let cleanPublicKey = publicKey.replace(/^(0x)?/, '');

  if (cleanPublicKey.startsWith('04')) {
    // compressed
    cleanPublicKey = cleanPublicKey.slice(2);
  } else {
    // uncompressed
    cleanPublicKey = EthCrypto.publicKey.decompress(cleanPublicKey);
  }

  // Hash the public key with Keccak-256
  const hash = keccak256(hexToBytes(cleanPublicKey));

  // Take the last 20 bytes and convert to hex with '0x' prefix
  const address = '0x' + bytesToHex(hash.slice(-20));

  return address;
}

/**
 * Convert Ethereum public key to Cosmos address
 * @param publicKeyHex - Ethereum public key. Accepts both compressed and uncompressed public keys.
 * @returns Cosmos address
 */
export function publicKeyToCosmosAddress(publicKeyHex: string): string {
  // Remove '0x' prefix
  let cleanPublicKey = publicKeyHex.replace(/^(0x)?/, '');

  if (cleanPublicKey.startsWith('04')) {
    // uncompressed
    cleanPublicKey = EthCrypto.publicKey.compress(cleanPublicKey);
  }

  // ripemd160 hash of sha256 hash of public key
  const hash = ripemd160(sha256(hexToBytes(cleanPublicKey)));

  // convert to hex with '0x' prefix
  const address = '0x' + bytesToHex(hash);

  return address;
}

/**
 * Convert Ethereum private key to Ethereum public key
 * @param privateKey - Ethereum private key
 * @returns Ethereum public key
 */
export function privateKeyToPublicKey(privateKey: string): string {
  const privateKeyBytes = hexToBytes(privateKey);
  const publicKey = secp256k1.getPublicKey(privateKeyBytes);
  return bytesToHex(publicKey).toUpperCase();
}

/**
 * Convert mnemonic to Keypair
 * @param mnemonic - Mnemonic
 * @param hdPath - HD path
 * @returns Keypair
 */
export function mnemonicToKeypair(
  mnemonic: string,
  hdPath: string = "m/44'/118'/0'/0/0" // Cosmos default HD path
): {
  privateKey: string;
  compressedPublicKey: string;
  uncompressedPublicKey: string;
} {
  const wallet = HDNodeWallet.fromPhrase(mnemonic, "", hdPath);

  return {
    privateKey: wallet.privateKey.slice(2).toUpperCase(),
    compressedPublicKey: wallet.signingKey.compressedPublicKey.slice(2).toUpperCase(),
    uncompressedPublicKey: wallet.signingKey.publicKey.slice(2).toUpperCase(),
  };
}
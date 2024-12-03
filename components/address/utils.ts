import EthCrypto from 'eth-crypto';
import { keccak256 } from "ethereum-cryptography/keccak";
import { ripemd160 } from "ethereum-cryptography/ripemd160";
import { sha256 } from "ethereum-cryptography/sha256";
import { bytesToHex, hexToBytes } from "ethereum-cryptography/utils";


export function publicKeyToEthereumAddress(publicKey: string): string {
  // Remove '0x' prefix
  let cleanPublicKey = publicKey.replace(/^(0x)?/, '');

  if (cleanPublicKey.startsWith('04')) {
    cleanPublicKey = cleanPublicKey.slice(2);
  } else {
    cleanPublicKey = EthCrypto.publicKey.decompress(cleanPublicKey);
  }

  // Hash the public key with Keccak-256
  const hash = keccak256(hexToBytes(cleanPublicKey));

  // Take the last 20 bytes and convert to hex with '0x' prefix
  const address = '0x' + bytesToHex(hash.slice(-20));

  return address;
}

export function publicKeyToCosmosAddress(publicKeyHex: string): string {
  // Remove '0x' prefix
  let cleanPublicKey = publicKeyHex.replace(/^(0x)?/, '');

  if (cleanPublicKey.startsWith('04')) {
    cleanPublicKey = EthCrypto.publicKey.compress(cleanPublicKey);
  }

  // ripemd160 hash of sha256 hash of public key
  const hash = ripemd160(sha256(hexToBytes(cleanPublicKey)));

  // convert to hex with '0x' prefix
  const address = '0x' + bytesToHex(hash);

  return address;
}

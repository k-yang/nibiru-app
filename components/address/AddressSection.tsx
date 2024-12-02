import {
  Box,
  Text,
  TextField
} from '@interchain-ui/react';
import converter from "bech32-converting";
import EthCrypto from 'eth-crypto';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { ripemd160 } from 'ethereum-cryptography/ripemd160';
import { sha256 } from 'ethereum-cryptography/sha256';
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils';
import { useReducer } from 'react';

type ReducerAction = {
  type: 'update_ethereum_address_hex' |
  'update_ethereum_address_bech32' |
  'update_cosmos_address_hex' |
  'update_cosmos_address_bech32' |
  'update_public_key';
  value: string;
}

function publicKeyToEthereumAddress(publicKey: string): string {
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

function publicKeyToCosmosAddress(publicKeyHex: string): string {
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

function reducer(state: any, action: ReducerAction) {
  if (action.value === '') {
    return { publicKey: '', ethereumAddressHex: '', ethereumAddressBech32: '', cosmosAddressHex: '', cosmosAddressBech32: '' };
  }

  // TODO: sanitize inputs further

  switch (action.type) {
    case 'update_ethereum_address_hex':
      return { ethereumAddressHex: action.value, ethereumAddressBech32: converter("nibi").toBech32(action.value), cosmosAddressHex: '', cosmosAddressBech32: '', publicKey: '' };
    case 'update_ethereum_address_bech32':
      return { ethereumAddressHex: converter("nibi").toHex(action.value), ethereumAddressBech32: action.value, cosmosAddressHex: '', cosmosAddressBech32: '', publicKey: '' };
    case 'update_cosmos_address_hex':
      return { cosmosAddressHex: action.value, cosmosAddressBech32: converter("nibi").toBech32(action.value), ethereumAddressHex: '', ethereumAddressBech32: '', publicKey: '' };
    case 'update_cosmos_address_bech32':
      return { cosmosAddressHex: converter("nibi").toHex(action.value), cosmosAddressBech32: action.value, ethereumAddressHex: '', ethereumAddressBech32: '', publicKey: '' };
    case 'update_public_key':
      // keccak-256 hash of the public key
      const ethereumAddressHex = publicKeyToEthereumAddress(action.value)
      const cosmosAddressHex = publicKeyToCosmosAddress(action.value)
      return { publicKey: action.value, ethereumAddressHex, ethereumAddressBech32: converter("nibi").toBech32(ethereumAddressHex), cosmosAddressHex, cosmosAddressBech32: converter("nibi").toBech32(cosmosAddressHex) };
    default:
      return state;
  }
}

const AddressSection = () => {
  // const { address } = useChain(DEFAULT_CHAIN_NAME);

  const [addresses, dispatch] = useReducer(reducer, {
    publicKey: '',
    ethereumAddressHex: '',
    ethereumAddressBech32: '',
    cosmosAddressHex: '',
    cosmosAddressBech32: '',
  });


  return (
    <>
      <Text fontSize="$2xl" fontWeight="$semibold" color="$red200">Address Tester</Text>
      <Box mb="$8">
        <Text fontSize="$lg" fontWeight="$semibold">Public Key</Text>
        <TextField value={addresses.publicKey} id="address" onChange={(e) => dispatch({ type: 'update_public_key', value: e.target.value })} />
      </Box>
      <Box display="flex" gap="$8">
        <Box mb={{ mobile: '$8', tablet: '$12' }} width={{ mobile: '100%', tablet: '50%' }}>
          <Text fontSize="$lg" fontWeight="$semibold">Ethereum Address (Hex)</Text>
          <TextField value={addresses.ethereumAddressHex} id="address" onChange={(e) => dispatch({ type: 'update_ethereum_address_hex', value: e.target.value })} />
        </Box>
        <Box mb={{ mobile: '$8', tablet: '$12' }} width={{ mobile: '100%', tablet: '50%' }}>
          <Text fontSize="$lg" fontWeight="$semibold">Ethereum Address (Bech32)</Text>
          <TextField value={addresses.ethereumAddressBech32} id="address" onChange={(e) => dispatch({ type: 'update_ethereum_address_bech32', value: e.target.value })} />
        </Box>
      </Box>

      <Box display="flex" gap="$8">
        <Box mb={{ mobile: '$8', tablet: '$12' }} width={{ mobile: '100%', tablet: '50%' }}>
          <Text fontSize="$lg" fontWeight="$semibold">Cosmos Address (Hex)</Text>
          <TextField value={addresses.cosmosAddressHex} id="address" onChange={(e) => dispatch({ type: 'update_cosmos_address_hex', value: e.target.value })} />
        </Box>
        <Box mb={{ mobile: '$8', tablet: '$12' }} width={{ mobile: '100%', tablet: '50%' }}>
          <Text fontSize="$lg" fontWeight="$semibold">Cosmos Address (Bech32)</Text>
          <TextField value={addresses.cosmosAddressBech32} id="address" onChange={(e) => dispatch({ type: 'update_cosmos_address_bech32', value: e.target.value })} />
        </Box>
      </Box>
    </>
  );
};

export default AddressSection;

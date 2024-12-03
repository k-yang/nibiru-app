import {
  Box,
  Text,
  TextField
} from '@interchain-ui/react';
import converter from "bech32-converting";
import { useReducer } from 'react';
import { publicKeyToCosmosAddress, publicKeyToEthereumAddress } from './utils';

type ReducerAction = {
  type: 'update_ethereum_address_hex' |
  'update_ethereum_address_bech32' |
  'update_cosmos_address_hex' |
  'update_cosmos_address_bech32' |
  'update_public_key';
  value: string;
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
      <Text fontSize="$2xl" fontWeight="$semibold" color="$red200" textAlign={'center'}>Address Converter</Text>
      <Box mb="$8">
        <Text fontSize="$lg" fontWeight="$semibold">Public Key</Text>
        <TextField value={addresses.publicKey} id="address" onChange={(e) => dispatch({ type: 'update_public_key', value: e.target.value })} />
      </Box>
      <Box display="flex" gap="$8">
        <Box display="flex" gap="$8" flexDirection={'column'} width={'50%'}>
          <Text fontSize="$lg" fontWeight="$semibold">Ethereum Address (Hex)</Text>
          <TextField value={addresses.ethereumAddressHex} id="address" onChange={(e) => dispatch({ type: 'update_ethereum_address_hex', value: e.target.value })} />
          <Text fontSize="$lg" fontWeight="$semibold">Ethereum Address (Bech32)</Text>
          <TextField value={addresses.ethereumAddressBech32} id="address" onChange={(e) => dispatch({ type: 'update_ethereum_address_bech32', value: e.target.value })} />
        </Box>
        <Box display="flex" flexDirection={'column'} gap="$8" width={'50%'}>
          <Text fontSize="$lg" fontWeight="$semibold">Cosmos Address (Hex)</Text>
          <TextField value={addresses.cosmosAddressHex} id="address" onChange={(e) => dispatch({ type: 'update_cosmos_address_hex', value: e.target.value })} />
          <Text fontSize="$lg" fontWeight="$semibold">Cosmos Address (Bech32)</Text>
          <TextField value={addresses.cosmosAddressBech32} id="address" onChange={(e) => dispatch({ type: 'update_cosmos_address_bech32', value: e.target.value })} />
        </Box>
      </Box>
    </>
  );
};

export default AddressSection;

import {
  Box,
  Text,
  TextField
} from '@interchain-ui/react';
import converter from "bech32-converting";
import { useReducer } from 'react';
import { mnemonicToKeypair, privateKeyToPublicKey, publicKeyToCosmosAddress, publicKeyToEthereumAddress } from './utils';

type ReducerAction = {
  type: 'update_ethereum_address_hex' |
  'update_ethereum_address_bech32' |
  'update_cosmos_address_hex' |
  'update_cosmos_address_bech32' |
  'update_public_key' |
  'update_private_key' |
  'update_mnemonic' |
  'update_hd_path' |
  'update_account_prefix';
  value: string;
}

type State = {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  ethereumAddressHex: string;
  ethereumAddressBech32: string;
  cosmosAddressHex: string;
  cosmosAddressBech32: string;
  hdPath: string;
  accountPrefix: string;
  errorText: string;
}

function reducer(state: State, action: ReducerAction): State {
  let ethereumAddressHex = ''
  let ethereumAddressBech32 = ''
  let cosmosAddressHex = ''
  let cosmosAddressBech32 = ''
  let publicKey = ''
  let privateKey = ''
  let mnemonic = ''
  let hdPath = state.hdPath
  let accountPrefix = state.accountPrefix
  let errorText = ''

  if (action.value === '') {
    return {
      mnemonic,
      publicKey,
      privateKey,
      ethereumAddressHex,
      ethereumAddressBech32,
      cosmosAddressHex,
      cosmosAddressBech32,
      hdPath,
      accountPrefix,
      errorText,
    };
  }

  try {
    switch (action.type) {
      case 'update_ethereum_address_hex':
        accountPrefix = state.accountPrefix
        ethereumAddressHex = action.value
        ethereumAddressBech32 = converter(accountPrefix).toBech32(ethereumAddressHex)
        break;
      case 'update_ethereum_address_bech32':
        accountPrefix = state.accountPrefix
        ethereumAddressBech32 = action.value
        ethereumAddressHex = converter(accountPrefix).toHex(ethereumAddressBech32)
        break;
      case 'update_cosmos_address_hex':
        accountPrefix = state.accountPrefix
        cosmosAddressHex = action.value
        cosmosAddressBech32 = converter(accountPrefix).toBech32(cosmosAddressHex)
        break;
      case 'update_cosmos_address_bech32':
        accountPrefix = state.accountPrefix
        cosmosAddressBech32 = action.value
        cosmosAddressHex = converter(accountPrefix).toHex(cosmosAddressBech32)
        break;
      case 'update_public_key':
        // keccak-256 hash of the public key
        publicKey = action.value

        ethereumAddressHex = publicKeyToEthereumAddress(publicKey)
        ethereumAddressBech32 = converter(accountPrefix).toBech32(ethereumAddressHex)

        cosmosAddressHex = publicKeyToCosmosAddress(publicKey)
        cosmosAddressBech32 = converter(accountPrefix).toBech32(cosmosAddressHex)
        break;
      case 'update_private_key':
        privateKey = action.value
        publicKey = privateKeyToPublicKey(privateKey)

        ethereumAddressHex = publicKeyToEthereumAddress(publicKey)
        ethereumAddressBech32 = converter(accountPrefix).toBech32(ethereumAddressHex)

        cosmosAddressHex = publicKeyToCosmosAddress(publicKey)
        cosmosAddressBech32 = converter(accountPrefix).toBech32(cosmosAddressHex)
        break;
      case 'update_mnemonic':
        mnemonic = action.value
        const keypair = mnemonicToKeypair(mnemonic, state.hdPath)
        privateKey = keypair.privateKey
        publicKey = keypair.compressedPublicKey

        ethereumAddressHex = publicKeyToEthereumAddress(publicKey)
        ethereumAddressBech32 = converter(accountPrefix).toBech32(ethereumAddressHex)

        cosmosAddressHex = publicKeyToCosmosAddress(publicKey)
        cosmosAddressBech32 = converter(accountPrefix).toBech32(cosmosAddressHex)
        break;
      case 'update_hd_path':
        hdPath = action.value
        mnemonic = state.mnemonic
        if (mnemonic != '') {
          const keypair = mnemonicToKeypair(mnemonic, hdPath)
          privateKey = keypair.privateKey
          publicKey = keypair.compressedPublicKey
        } else if (state.privateKey != '') {
          privateKey = state.privateKey
          publicKey = privateKeyToPublicKey(privateKey)
        }
        ethereumAddressHex = publicKeyToEthereumAddress(publicKey)
        ethereumAddressBech32 = converter(accountPrefix).toBech32(ethereumAddressHex)
        cosmosAddressHex = publicKeyToCosmosAddress(publicKey)
        cosmosAddressBech32 = converter(accountPrefix).toBech32(cosmosAddressHex)
        break;
      case 'update_account_prefix':
        accountPrefix = action.value
        hdPath = state.hdPath
        mnemonic = state.mnemonic
        if (mnemonic != '') {
          const keypair = mnemonicToKeypair(mnemonic, hdPath)
          privateKey = keypair.privateKey
          publicKey = keypair.compressedPublicKey
        } else if (state.privateKey != '') {
          privateKey = state.privateKey
          publicKey = privateKeyToPublicKey(privateKey)
        }
        ethereumAddressHex = publicKeyToEthereumAddress(publicKey)
        ethereumAddressBech32 = converter(accountPrefix).toBech32(ethereumAddressHex)
        cosmosAddressHex = publicKeyToCosmosAddress(publicKey)
        cosmosAddressBech32 = converter(accountPrefix).toBech32(cosmosAddressHex)
        break;
      default:
        break;
    }
  } catch (error) {
    switch (action.type) {
      case 'update_mnemonic':
        errorText = 'Invalid mnemonic'
        break;
      case 'update_private_key':
        errorText = 'Invalid private key'
        break;
      case 'update_public_key':
        errorText = 'Invalid public key'
        break;
      case 'update_ethereum_address_hex':
        errorText = 'Invalid Ethereum address (Hex)'
        break;
      case 'update_ethereum_address_bech32':
        errorText = 'Invalid Ethereum address (Bech32)'
        break;
      case 'update_cosmos_address_hex':
        errorText = 'Invalid Cosmos address (Hex)'
        break;
      case 'update_cosmos_address_bech32':
        errorText = 'Invalid Cosmos address (Bech32)'
        break;
      case 'update_hd_path':
        errorText = 'Invalid HD path'
        break;
      case 'update_account_prefix':
        errorText = 'Invalid account prefix'
        break;
    }
  }

  return {
    mnemonic,
    privateKey,
    publicKey,
    ethereumAddressHex,
    ethereumAddressBech32,
    cosmosAddressHex,
    cosmosAddressBech32,
    hdPath,
    accountPrefix,
    errorText,
  };
}

const AddressSection = () => {
  const [state, dispatch] = useReducer(reducer, {
    mnemonic: '',
    hdPath: "m/44'/118'/0'/0/0",
    accountPrefix: 'nibi',
    privateKey: '',
    publicKey: '',
    ethereumAddressHex: '',
    ethereumAddressBech32: '',
    cosmosAddressHex: '',
    cosmosAddressBech32: '',
    errorText: '',
  });


  return (
    <>
      <Box display="flex" flexDirection={'column'} gap="$8">
        <Text fontSize="$2xl" fontWeight="$bold" color="$red200" textAlign={'center'}>Address Converter</Text>
        <Text fontSize={"$lg"} color="$gray300" textAlign={'left'}>
          A tool for converting between Ethereum and Cosmos addresses.
          The mnemonic and private key inputs are optional.
          There&apos;s no need to input a mnemonic and/or private key into a public website if you don&apos;t trust it.
          The tool works with just a public key input. The tool also works with just an address input, but it will only derive one side (Ethereum or Cosmos), not both.
          Also, the code for this website is open source and <a href="https://github.com/k-yang/nibiru-app">available on Github</a>.
        </Text>
        <Text color="$red500" textAlign={'center'} fontSize={'$xl'} fontWeight={"$semibold"}>{state.errorText}</Text>

        <Text fontSize="$lg" fontWeight="$semibold">Mnemonic (optional)</Text>
        <TextField value={state.mnemonic} id="mnemonic" onChange={(e) => dispatch({ type: 'update_mnemonic', value: e.target.value })} />

        <Text fontSize="$lg" fontWeight="$semibold">Private Key (optional)</Text>
        <TextField value={state.privateKey} id="private key" onChange={(e) => dispatch({ type: 'update_private_key', value: e.target.value })} />

        <Text fontSize="$lg" fontWeight="$semibold">Public Key</Text>
        <TextField value={state.publicKey} id="public key" onChange={(e) => dispatch({ type: 'update_public_key', value: e.target.value })} />

        <Box display="flex" gap="$16">
          <Box display="flex" gap="$8" flexDirection={'column'} width={'50%'}>
            {/* <Text fontSize={'$xl'} fontWeight="$semibold">HD Path: <Text color={"$red500"} fontSize="$lg" fontWeight="$semibold" as="span">m/44'/60'/0'/0/0</Text></Text> */}
            <Text fontSize="$lg" fontWeight="$semibold">Ethereum Address (Hex)</Text>
            <TextField value={state.ethereumAddressHex} id="ethereum address hex" onChange={(e) => dispatch({ type: 'update_ethereum_address_hex', value: e.target.value })} />
            <Text fontSize="$lg" fontWeight="$semibold">Ethereum Address (Bech32)</Text>
            <TextField value={state.ethereumAddressBech32} id="ethereum address bech32" onChange={(e) => dispatch({ type: 'update_ethereum_address_bech32', value: e.target.value })} />
          </Box>
          <Box display="flex" flexDirection={'column'} gap="$8" width={'50%'}>
            {/* <Text fontSize={'$xl'} fontWeight="$semibold">HD Path: <Text color={"$red500"} fontSize="$lg" fontWeight="$semibold" as="span">m/44'/118'/0'/0/0</Text></Text> */}
            <Text fontSize="$lg" fontWeight="$semibold">Cosmos Address (Hex)</Text>
            <TextField value={state.cosmosAddressHex} id="cosmos address hex" onChange={(e) => dispatch({ type: 'update_cosmos_address_hex', value: e.target.value })} />
            <Text fontSize="$lg" fontWeight="$semibold">Cosmos Address (Bech32)</Text>
            <TextField value={state.cosmosAddressBech32} id="cosmos address bech32" onChange={(e) => dispatch({ type: 'update_cosmos_address_bech32', value: e.target.value })} />
          </Box>
        </Box>

        <Box display="flex" gap="$16">
          <Box display="flex" gap="$8" flexDirection={'column'} width={'50%'}>
            <Text fontSize="$lg" fontWeight="$semibold">HD Path</Text>
            <Text fontSize="$sm" color="$gray500">Advanced, only use if you know what you&apos;re doing. This is the path to the account in the HD wallet. The default for Nibiru Chain is m/44&apos;/118&apos;/0&apos;/0/0. Ethereum uses m/44&apos;/60&apos;/0&apos;/0/0.</Text>
            <TextField value={state.hdPath} id="hd path" onChange={(e) => dispatch({ type: 'update_hd_path', value: e.target.value })} />
          </Box>
          <Box display="flex" flexDirection={'column'} gap="$8" width={'50%'}>
            <Text fontSize="$lg" fontWeight="$semibold">Account Prefix</Text>
            <Text fontSize="$sm" color="$gray500">Advanced, only use if you know what you&apos;re doing. This is the prefix for the accoutn address. The default for Nibiru Chain is nibi. Cosmoshub uses cosmos.</Text>
            <TextField value={state.accountPrefix} id="account prefix" onChange={(e) => dispatch({ type: 'update_account_prefix', value: e.target.value })} />
          </Box>
        </Box>
      </Box>

    </>
  );
};

export default AddressSection;

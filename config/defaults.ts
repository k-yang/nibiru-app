import { Asset, AssetList } from '@chain-registry/types';
import { assets } from 'chain-registry';

export const CHAIN_NAME = 'cosmoshub';
export const defaultChainName = 'osmosis';

export const getChainAssets = (chainName: string = defaultChainName) => {
  return assets.find((chain) => chain.chain_name === chainName) as AssetList;
};

export const getCoin = (chainName: string = defaultChainName) => {
  const chainAssets = getChainAssets(chainName);
  return chainAssets.assets[0] as Asset;
};

export const getExponent = (chainName: string) => {
  return getCoin(chainName).denom_units.find(
    (unit) => unit.denom === getCoin(chainName).display
  )?.exponent as number;
};

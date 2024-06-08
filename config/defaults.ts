import { Asset, AssetList } from '@chain-registry/types';
import { assets } from 'chain-registry';

export const DEFAULT_CHAIN_NAME = 'nibiru';

export const getChainAssets = (chainName: string = DEFAULT_CHAIN_NAME) => {
  return assets.find((chain) => chain.chain_name === chainName) as AssetList;
};

export const getCoin = (chainName: string = DEFAULT_CHAIN_NAME) => {
  const chainAssets = getChainAssets(chainName);
  return chainAssets.assets[0] as Asset;
};

export const getExponent = (chainName: string) => {
  return getCoin(chainName).denom_units.find(
    (unit) => unit.denom === getCoin(chainName).display
  )?.exponent as number;
};

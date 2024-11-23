import { Asset, Chain } from '@chain-registry/types';
import { chains } from 'chain-registry';

export function getLogo(from: Asset | Chain) {
  return from.logo_URIs?.svg || from.logo_URIs?.png;
}

export function getChainLogo(name: string) {
  const chain = chains.find(chain => chain.chain_name === name)
  return chain ? getLogo(chain) : null;
}


export * from './logos';
export * from './math';
export * from './staking';


import { useChain } from '@cosmos-kit/react';
import {
  createRpcQueryHooks,
  useRpcClient,
  useRpcEndpoint
} from 'interchain-query';
import { useMemo } from 'react';

import { DEFAULT_CHAIN_NAME, getCoin, getExponent } from '@/config';
import {
  shiftDigits
} from '@/utils';
import { usePrices } from './usePrices';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};


export const useBankData = () => {
  const { address, getRpcEndpoint } = useChain(DEFAULT_CHAIN_NAME);

  const coin = getCoin(DEFAULT_CHAIN_NAME);
  const exp = getExponent(DEFAULT_CHAIN_NAME);

  const rpcEndpointQuery = useRpcEndpoint({
    getter: () => Promise.resolve("https://rpc.nibiru.fi"),
    options: {
      enabled: !!address,
      staleTime: Infinity,
      queryKeyHashFn: (queryKey) => {
        return JSON.stringify([...queryKey, DEFAULT_CHAIN_NAME]);
      },
    },
  });

  const rpcClientQuery = useRpcClient({
    rpcEndpoint: rpcEndpointQuery.data || '',
    options: {
      enabled: !!address && !!rpcEndpointQuery.data,
      staleTime: Infinity,
    },
  });

  const { cosmos: cosmosQuery, cosmwasm: cosmwasmQuery } = createRpcQueryHooks({
    rpc: rpcClientQuery.data,
  });

  const isDataQueryEnabled = !!address && !!rpcClientQuery.data;

  const balanceQuery = cosmosQuery.bank.v1beta1.useBalance({
    request: {
      address: address || '',
      denom: coin.base,
    },
    options: {
      enabled: isDataQueryEnabled,
      select: ({ balance }) => shiftDigits(balance?.amount || '0', -exp),
    },
  });

  const allBalancesQuery = cosmosQuery.bank.v1beta1.useAllBalances({
    request: {
      address: address || '',
    },
    options: {
      enabled: isDataQueryEnabled,
      select: ({ balances }) => balances.map(({ amount, denom }) => ({
        amount: shiftDigits(amount, -exp),
        denom,
      })),
    },
  });

  const pricesQuery = usePrices();

  const allQueries = {
    balance: balanceQuery,
    allBalances: allBalancesQuery,
    prices: pricesQuery,
  };

  const updatableQueriesAfterMutation = [
    allQueries.balance,
    allQueries.allBalances,
  ];

  const isInitialFetching = Object.values(allQueries).some(
    ({ isLoading }) => isLoading
  );

  const isRefetching = Object.values(allQueries).some(
    ({ isRefetching }) => isRefetching
  );

  const isLoading = isInitialFetching || isRefetching;

  type AllQueries = typeof allQueries;
  type QueriesData = {
    [Key in keyof AllQueries]: NonNullable<AllQueries[Key]['data']>;
  };

  const data = useMemo(() => {
    if (isLoading) return;

    const queriesData = Object.fromEntries(
      Object.entries(allQueries).map(([key, query]) => [key, query.data])
    ) as QueriesData;

    return queriesData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const refetch = () => {
    updatableQueriesAfterMutation.forEach((query) => query.refetch());
  };

  return { data, isLoading, refetch };
};

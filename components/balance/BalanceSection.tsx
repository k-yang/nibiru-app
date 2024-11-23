import { useChain } from '@cosmos-kit/react';
import { Box, Spinner, Text } from '@interchain-ui/react';

import { DEFAULT_CHAIN_NAME } from '@/config';
import { useBankData } from '@/hooks';
import BalanceOverview from './BalanceOverview';

export const BalanceSection = () => {
  const { isWalletConnected } = useChain(DEFAULT_CHAIN_NAME);
  const { data, isLoading } = useBankData();

  return (
    <Box my="$16">
      {!isWalletConnected ? (
        <Box
          height="$28"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontWeight="$semibold" fontSize="$xl">
            Please connect the wallet
          </Text>
        </Box>
      ) : isLoading || !data ? (
        <Box
          height="$28"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="$7xl" />
        </Box>
      ) : (
        <BalanceOverview
          balance={data.balance}
          chainName={DEFAULT_CHAIN_NAME}
          prices={data.prices}
        />
      )}
    </Box>
  );
};

import { useChain } from '@cosmos-kit/react';
import { Box, Spinner, Text } from '@interchain-ui/react';

import { DEFAULT_CHAIN_NAME } from '@/config';
import { useStakingData, useValidatorLogos } from '@/hooks';
import { AllValidators } from './AllValidators';
import { MyValidators } from './MyValidators';
import Overview from './Overview';

export const StakingSection = () => {
  const { isWalletConnected } = useChain(DEFAULT_CHAIN_NAME);
  const { data, isLoading, refetch } = useStakingData(DEFAULT_CHAIN_NAME);
  const { data: logos, isLoading: isFetchingLogos } = useValidatorLogos(
    DEFAULT_CHAIN_NAME,
    data?.allValidators || []
  );

  console.log(data);

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
      ) : isLoading || isFetchingLogos || !data ? (
        <Box
          height="$28"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="$7xl" />
        </Box>
      ) : (
        <>
          <Overview
            balance={data.balance}
            rewards={data.rewards}
            staked={data.totalDelegated}
            updateData={refetch}
            chainName={DEFAULT_CHAIN_NAME}
            prices={data.prices}
          />

          {data.myValidators.length > 0 && (
            <MyValidators
              myValidators={data.myValidators}
              allValidators={data.allValidators}
              balance={data.balance}
              updateData={refetch}
              unbondingDays={data.unbondingDays}
              chainName={DEFAULT_CHAIN_NAME}
              logos={logos}
              prices={data.prices}
            />
          )}

          <AllValidators
            balance={data.balance}
            validators={data.allValidators}
            updateData={refetch}
            unbondingDays={data.unbondingDays}
            chainName={DEFAULT_CHAIN_NAME}
            logos={logos}
            prices={data.prices}
          />
        </>
      )}
    </Box>
  );
};

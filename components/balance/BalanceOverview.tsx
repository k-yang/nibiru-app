import {
  Box,
  SingleChain
} from '@interchain-ui/react';
import { ChainName } from 'cosmos-kit';

import { getCoin } from '@/config';
import { Prices } from '@/hooks';
import {
  calcDollarValue
} from '@/utils';


const BalanceOverview = ({
  balance,
  chainName,
  prices,
}: {
  balance: string;
  chainName: ChainName;
  prices: Prices;
}) => {
  const coin = getCoin(chainName);

  return (
    <>
      <Box mb={{ mobile: '$8', tablet: '$12' }}>
        <SingleChain
          title='My Assets'
          singleChainHeader={{
            label: 'Total on Nibiru',
            value: calcDollarValue(coin.base, balance, prices).toString(),
          }}
          showDeposit={false}
          showWithdraw={false}
          listTitle='On Nibiru'
          list={[
            {
              imgSrc: coin.logo_URIs?.png || coin.logo_URIs?.svg || coin.logo_URIs?.jpeg || '',
              symbol: coin.symbol,
              name: coin.name,
              tokenAmount: balance,
              tokenAmountPrice: "$" + calcDollarValue(coin.base, balance, prices).toString(),
              showDeposit: false,
              showWithdraw: false,
            },
          ]}
        />
      </Box>
    </>
  );
};

export default BalanceOverview;

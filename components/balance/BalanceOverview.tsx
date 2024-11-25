import {
  Box,
  SingleChain,
  SingleChainListItemProps
} from '@interchain-ui/react';
import { ChainName } from 'cosmos-kit';

import { getChainAssets } from '@/config';
import { Prices } from '@/hooks';
import {
  calcDollarValue
} from '@/utils';


const BalanceOverview = ({
  balances,
  chainName,
  prices,
}: {
  balances: {
    amount: string;
    denom: string;
  }[];
  chainName: ChainName;
  prices: Prices;
}) => {

  const totalValue = balances.reduce((acc, { amount, denom }) => {
    return acc + calcDollarValue(denom, amount, prices);
  }, 0);

  const assetList = getChainAssets(chainName);
  const displayList: SingleChainListItemProps[] = balances.map(({ amount, denom }) => {
    const asset = assetList.assets.find(({ base }) => base === denom);
    return {
      imgSrc: asset?.logo_URIs?.png || asset?.logo_URIs?.svg || '',
      symbol: asset?.symbol || denom,
      name: asset?.name || denom,
      tokenAmount: amount,
      tokenAmountPrice: "$" + calcDollarValue(denom, amount, prices).toString(),
      showDeposit: false,
      showWithdraw: false,
    }
  })

  return (
    <>
      <Box mb={{ mobile: '$8', tablet: '$12' }}>
        <SingleChain
          title='My Assets'
          singleChainHeader={{
            label: 'Total on Nibiru',
            value: totalValue.toString(),
          }}
          showDeposit={false}
          showWithdraw={false}
          listTitle='On Nibiru'
          list={displayList}
        />
      </Box>
    </>
  );
};

export default BalanceOverview;

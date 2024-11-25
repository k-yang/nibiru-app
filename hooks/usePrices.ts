import { AssetList } from '@chain-registry/types';
import { useQuery } from '@tanstack/react-query';
import { assets } from 'chain-registry';

type CoinGeckoId = string;
type CoinGeckoUSD = { usd: number };
type CoinGeckoUSDResponse = Record<CoinGeckoId, CoinGeckoUSD>;
export type Prices = Record<CoinGeckoId, CoinGeckoUSD['usd']>;

const handleError = (resp: Response) => {
  if (!resp.ok) throw Error(resp.statusText);
  return resp;
};

const getGeckoIdsFromAssets = (assets: AssetList[]) => {
  return assets
    .map((asset) => asset.assets[0].coingecko_id)
    .filter(Boolean) as string[];
};

const formatPrices = (
  prices: CoinGeckoUSDResponse,
  assets: AssetList[]
): Prices => {
  return Object.entries(prices).reduce((priceHash, cur) => {
    const assetList = assets.find(
      (asset) => asset.assets[0].coingecko_id === cur[0]
    )!;
    const denom = assetList.assets[0].base;
    return { ...priceHash, [denom]: cur[1].usd };
  }, {});
};

const fetchPrices = async (
  geckoIds: string[]
): Promise<CoinGeckoUSDResponse> => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${geckoIds.join()}&vs_currencies=usd`;

  return fetch(url)
    .then(handleError)
    .then((res) => res.json());
};

export const usePrices = () => {
  const geckoIds = getGeckoIdsFromAssets(assets);

  return useQuery({
    queryKey: ['prices'],
    queryFn: () => fetchPrices(geckoIds),
    select: (data) => {
      const formattedPrices = formatPrices(data, assets);
      console.log(formattedPrices);
      return {
        ...formattedPrices,
        'tf/nibi1udqqx30cw8nwjxtl4l28ym9hhrp933zlq8dqxfjzcdhvl8y24zcqpzmh8m/ampNIBI': formattedPrices['unibi'] * 1.085,
        'ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349': 1,
      }
    },
    staleTime: Infinity,
  });
};

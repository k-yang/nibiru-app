import { Layout, StakingSection, WalletSection } from '@/components';
import { DEFAULT_CHAIN_NAME } from '@/config';
import { Divider } from '@interchain-ui/react';
import { ReactNoSSR } from '@interchain-ui/react-no-ssr';

export default function SingleChain() {
  return (
    <Layout>
      <WalletSection isMultiChain={true} providedChainName={DEFAULT_CHAIN_NAME} />
      <Divider height="0.1px" mt="$12" />
      {/* TODO fix type error */}
      {/* Type error: This JSX tag's 'children' prop expects a single child of type 'ReactNode', but multiple children were provided. */}
      {/* @ts-ignore */}
      <ReactNoSSR>
        <StakingSection chainName={DEFAULT_CHAIN_NAME} />
      </ReactNoSSR>
    </Layout>
  );
}

import { Layout, StakingSection, WalletSection } from '@/components';
import { Divider } from '@interchain-ui/react';
import { ReactNoSSR } from '@interchain-ui/react-no-ssr';

export default function SingleChain() {
  return (
    <Layout>
      <WalletSection />
      <Divider height="0.1px" mt="$12" />
      {/* TODO fix type error */}
      {/* Type error: This JSX tag's 'children' prop expects a single child of type 'ReactNode', but multiple children were provided. */}
      {/* @ts-ignore */}
      <ReactNoSSR>
        <StakingSection />
      </ReactNoSSR>
    </Layout>
  );
}

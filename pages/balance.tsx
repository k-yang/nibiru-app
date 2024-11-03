import { Layout, StakingSection, WalletTester } from "@/components";
import { DEFAULT_CHAIN_NAME } from "@/config";
import { Divider } from "@interchain-ui/react";
import { ReactNoSSR } from '@interchain-ui/react-no-ssr';

export default function Home() {
  return (
    <Layout>
      <WalletTester />
      <Divider height="0.1px" mt="$12" />
      <ReactNoSSR>
        <StakingSection chainName={DEFAULT_CHAIN_NAME} />
      </ReactNoSSR>
    </Layout>
  );
}

import { BalanceSection, Layout, WalletTester } from "@/components";
import { Divider } from "@interchain-ui/react";
import { ReactNoSSR } from "@interchain-ui/react-no-ssr";

export default function BalancePage() {
  return (
    <Layout>
      <WalletTester />
      <Divider height="0.1px" mt="$12" />
      <ReactNoSSR>
        <BalanceSection />
      </ReactNoSSR>
    </Layout>
  );
}

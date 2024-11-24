import { Container } from "@interchain-ui/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Head from "next/head";
import { Footer } from "./Footer";
import { Header } from "./Header";
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="64rem" attributes={{ py: "$14" }}>
      <Head>
        <title>Kevin Nibiru App</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {children}
      <SpeedInsights />
      <Footer />
    </Container>
  );
}

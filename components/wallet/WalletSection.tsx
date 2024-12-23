// @ts-nocheck
import { useChain, useManager } from '@cosmos-kit/react';
import { Box, Stack, useTheme } from '@interchain-ui/react';
import { MouseEventHandler, useEffect, useMemo } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

import { DEFAULT_CHAIN_NAME } from '@/config';
import { ChainName } from 'cosmos-kit';
import { ConnectedShowAddress, CopyAddressBtn } from './AddressCard';
import { Astronaut } from './Astronaut';
import { ChainCard } from './ChainCard';
import { UserInfo } from './UserInfo';
import {
  Connected,
  Connecting,
  Disconnected,
  Error,
  NotExist,
  Rejected,
  WalletConnectComponent
} from './WalletConnect';
import { ConnectStatusWarn, RejectedWarn } from './WarnBlock';

export interface WalletSectionProps {
  setChainName?: (chainName: ChainName | undefined) => void;
}

export const WalletSection = ({
  setChainName,
}: WalletSectionProps) => {
  const { chainRecords, getChainLogo } = useManager();
  const {
    connect,
    openView,
    status,
    username,
    address,
    message,
    wallet,
    chain: chainInfo,
  } = useChain(DEFAULT_CHAIN_NAME);

  const { theme } = useTheme();

  const chain = {
    chainName: DEFAULT_CHAIN_NAME,
    label: chainInfo.pretty_name,
    value: DEFAULT_CHAIN_NAME,
    icon: getChainLogo(DEFAULT_CHAIN_NAME),
  };

  const chainOptions = useMemo(
    () =>
      chainRecords.map((chainRecord) => {
        return {
          chainName: chainRecord?.name,
          label: chainRecord?.chain?.pretty_name ?? '',
          value: chainRecord?.name,
          icon: getChainLogo(chainRecord.name),
        };
      }),
    [chainRecords, getChainLogo]
  );

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={status}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={'My Wallet'} onClick={onClickOpenView} />
      }
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
      notExist={
        <NotExist buttonText="Install Wallet" onClick={onClickOpenView} />
      }
    />
  );

  const connectWalletWarn = message ? (
    <ConnectStatusWarn
      walletStatus={status}
      rejected={
        <RejectedWarn
          icon={
            <Box mt="$2">
              <FiAlertTriangle />
            </Box>
          }
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={
            <Box mt="$2">
              <FiAlertTriangle />
            </Box>
          }
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
    />
  ) : null;

  useEffect(() => {
    setChainName?.(
      window.localStorage.getItem('selected-chain') || DEFAULT_CHAIN_NAME
    );
  }, [setChainName]);


  const userInfo = username && (
    <UserInfo username={username} icon={<Astronaut />} />
  );

  const addressBtn = (
    <CopyAddressBtn
      walletStatus={status}
      connected={<ConnectedShowAddress address={address} isLoading={false} />}
    />
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      py="$12"
      width="100%"
      attributes={{
        'data-part-id': 'wallet-section',
      }}
    >
      <Box
        display="grid"
        width="$full"
        maxWidth={{
          mobile: '100%',
          tablet: '450px',
        }}
        gridTemplateColumns="1fr"
        rowGap="$10"
        alignItems="center"
        justifyContent="center"
      >

        <Box marginBottom={'$9'}>
          <ChainCard
            prettyName={chain?.label || DEFAULT_CHAIN_NAME}
            icon={chain?.icon}
          />
        </Box>

        <Box px={6}>
          <Stack
            direction="vertical"
            attributes={{
              px: '$2',
              py: '$12',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '$lg',
              backgroundColor: theme === 'light' ? '$white' : '$cardBg',
              boxShadow:
                theme === 'light'
                  ? '0 0 2px #dfdfdf, 0 0 6px -2px #d3d3d3'
                  : '0 0 2px #363636, 0 0 8px -2px #4f4f4f',
            }}
            space="$8"
          >
            {userInfo}
            {addressBtn}

            <Box
              width="100%"
              maxWidth="200px"
              attributes={{ id: 'connect-button' }}
            >
              {connectWalletButton}
            </Box>

            {connectWalletWarn}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

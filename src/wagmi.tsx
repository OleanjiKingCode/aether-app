import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  bsc,
  polygon,
  bscTestnet,
  sepolia,
  polygonAmoy,
  mainnet,
} from "wagmi/chains";
import { getWalletClient, switchChain } from "@wagmi/core";
import { useSyncWagmiConfig } from "@lifi/wallet-management";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { CreateConnectorFn } from "wagmi";
import { WagmiProvider } from "wagmi";

import { type FC, type PropsWithChildren } from "react";

import {
  metaMaskWallet,
  walletConnectWallet,
  injectedWallet,
  braveWallet,
  phantomWallet,
  coinbaseWallet,
  trustWallet,
  rainbowWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { IS_TEST_MODE } from "@/config/constant/environment";
import { ChainType, EVM, createConfig, getChains } from "@lifi/sdk";

import { injected } from "wagmi/connectors";

export const config = getDefaultConfig({
  appName: "Aether",
  projectId: "c58ac3f141e930783d46400601b12b3a",
  wallets: [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        trustWallet,
        rainbowWallet,
      ],
    },
    {
      groupName: "More",
      wallets: [injectedWallet, braveWallet, phantomWallet, ledgerWallet],
    },
  ],
  chains: [
    bsc,
    polygon,
    arbitrum,
    mainnet,
    ...(IS_TEST_MODE ? [bscTestnet, sepolia] : []),
  ],
  ssr: true,
  transports: {
    [bsc.id]: http(
      "https://bnb-mainnet.g.alchemy.com/v2/88_13_DKKokxF6KNwkwG4qCrVudgq2R8"
    ),
    [polygon.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    ...(IS_TEST_MODE
      ? {
          [bscTestnet.id]: http(),
          [sepolia.id]: http(
            "https://sepolia.infura.io/v3/28daf59330ba470b95ba3285561a6ed4"
          ),
          [polygonAmoy.id]: http(),
        }
      : ({} as Record<number, typeof http>)),
  },
});

// Create SDK config using Wagmi actions and configuration
const configLIFI = createConfig({
  integrator: "aetherDex",
  apiKey:
    "3b6d01c6-9d28-4de0-9df9-8bcabecb4be3.4fa6781c-0d9f-4dce-8793-6a953f224edc",
  routeOptions: {
    fee: 0.02, // 2% fee on all swaps
  },
  providers: [
    EVM({
      getWalletClient: () => getWalletClient(config as any),
      switchChain: async (chainId: number) => {
        const chain = await switchChain(config as any, {
          chainId: chainId as unknown as never,
        });
        return getWalletClient(config as any, {
          chainId: (chain as { id: number }).id,
        });
      },
    }),
  ],
  // We disable chain preloading and will update chain configuration in runtime
  preloadChains: false,
});
// List of Wagmi connectors
const connectors: CreateConnectorFn[] = [injected()];

// Create a QueryClient instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Inner component that uses the query
const WagmiConfigWrapper: FC<PropsWithChildren> = ({ children }) => {
  // Load EVM chains from LI.FI API using getChains action from LI.FI SDK
  const { data: chains } = useQuery({
    queryKey: ["chains"] as const,
    queryFn: async () => {
      const chains = await getChains({
        chainTypes: [ChainType.EVM],
      });
      // Update chain configuration for LI.FI SDK
      if (
        "setChains" in configLIFI &&
        typeof configLIFI.setChains === "function"
      ) {
        configLIFI.setChains(chains);
      }
      return chains;
    },
  });

  // Synchronize fetched chains with Wagmi config and update connectors
  useSyncWagmiConfig(config, connectors, chains);

  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  );
};

// Outer provider component
export const CustomWagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfigWrapper>{children}</WagmiConfigWrapper>
    </QueryClientProvider>
  );
};

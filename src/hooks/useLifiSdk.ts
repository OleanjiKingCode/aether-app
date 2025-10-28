import { useEffect } from "react";
import { config, EVM, Solana } from "@lifi/sdk";
import { useConfig, useWalletClient } from "wagmi";
import { getWalletClient, switchChain } from "@wagmi/core";
import { useWallet } from "@solana/wallet-adapter-react";
import type { SignerWalletAdapter } from "@solana/wallet-adapter-base";

export const useLifiSdk = (integrator: string = "aetherdapp") => {
  const wagmiConfig = useConfig();
  const { wallet } = useWallet();

  useEffect(() => {
    // Initialize LI.FI SDK configuration with both EVM and Solana providers
    const evmProvider = EVM({
      getWalletClient: () => getWalletClient(wagmiConfig),
      switchChain: async (chainId) => {
        const chain = await switchChain(wagmiConfig, { chainId });
        return getWalletClient(wagmiConfig, { chainId: chain.id });
      },
    });

    const providers: unknown[] = [evmProvider];

    // Add Solana provider if wallet is connected
    if (wallet?.adapter) {
      console.log("Configuring Solana provider for LI.FI SDK");
      const solanaProvider = Solana({
        async getWalletAdapter() {
          return wallet.adapter as SignerWalletAdapter;
        },
      });
      providers.push(solanaProvider);
    }

    config.set({
      integrator,
      apiUrl: "https://li.quest/v1",
      debug: process.env.NODE_ENV === "development",
    });

    // Set providers
    config.setProviders(providers as never);

    console.log("LI.FI SDK configured with providers:", providers.length);
  }, [integrator, wagmiConfig, wallet?.adapter]);
};

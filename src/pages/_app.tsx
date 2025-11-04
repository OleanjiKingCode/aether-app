import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { Inter_Tight } from "next/font/google";
// import { config } from "@/wagmi";
import { ThemeProvider } from "next-themes";
import { GlobalProvider } from "@/context/GlobalContext";
import Header from "@/components/header";
import Navbar from "@/components/navbar";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import AlertModal from "@/components/common/modals/alert-modal";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { solanaWallets, solanaRpcEndpoint } from "@/solana";
import { WalletContextProvider } from "@/context/WalletContext";
import { BirdEyeProvider } from "@/context/BirdEyeContext";
import { useMemo } from "react";
import { CustomWagmiProvider } from "@/wagmi";
import ToastWrapper from "@/components/common/toast-wrapper";

const interTight = Inter_Tight({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: "normal",
  preload: false,
  variable: "--font-inter",
});

const client = new QueryClient();

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

function MyApp({ Component, pageProps }: AppProps) {
  const wallets = useMemo(() => solanaWallets, []);

  return (
    <ThemeProvider attribute="class">
      <ConnectionProvider endpoint={solanaRpcEndpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <CustomWagmiProvider>
              <QueryClientProvider client={client}>
                <RainbowKitProvider
                  modalSize="compact"
                  theme={darkTheme({
                    accentColor: "#bb3eff",
                    accentColorForeground: "white",
                    borderRadius: "medium",
                    fontStack: "system",
                  })}
                  appInfo={{
                    appName: "Aether",
                    learnMoreUrl: "https://learnaboutcryptowallets.example",
                  }}
                  showRecentTransactions={true}
                >
                  <WalletContextProvider>
                    <BirdEyeProvider>
                      <GlobalProvider>
                        <main
                          className={`${interTight.variable} ${instrumentSerif.variable} ${geistMono.variable} bg-[#010314]`}
                        >
                          <QueryClientProvider client={client}>
                            <div className="flex flex-row w-full font-geist-mono">
                              <Navbar />
                              <div className="w-full">
                                <Header />
                                <Component {...pageProps} />
                              </div>
                            </div>
                          </QueryClientProvider>
                        </main>
                        <AlertModal />
                        <ToastWrapper />
                      </GlobalProvider>
                    </BirdEyeProvider>
                  </WalletContextProvider>
                </RainbowKitProvider>
              </QueryClientProvider>
            </CustomWagmiProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default MyApp;

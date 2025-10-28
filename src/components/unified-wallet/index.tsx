import React, { useState } from "react";
import Head from "next/head";
import { useAccount } from "wagmi";
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { Inter_Tight } from 'next/font/google';
import Image from "next/image";
import { useWalletContext } from '@/context/WalletContext';
import { SolanaAccountModal } from './solana-account-modal';

const interTight = Inter_Tight({
    weight: "700",
    style: "normal",
    preload: false,
});

interface UnifiedWalletProps {
    containerClassName?: string;
    connectbuttonClassName?: string;
    isShowNetwork?: boolean;
    isShowAddressInMobile?: boolean;
}

export default function UnifiedWallet({
    containerClassName,
    connectbuttonClassName,
    isShowNetwork,
    isShowAddressInMobile
}: UnifiedWalletProps) {
    const [showNetworkSelector, setShowNetworkSelector] = useState(false);
    const [showSolanaAccountModal, setShowSolanaAccountModal] = useState(false);
    const { activeWalletType, setActiveWalletType, isConnected } = useWalletContext();
    
    // EVM wallet hooks
    const { address: evmAddress, isConnected: evmConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    
    // Solana wallet hooks
    const { publicKey, connected: solanaConnected, disconnect: disconnectSolana } = useWallet();
    const { setVisible: setSolanaModalVisible } = useWalletModal();
    const solanaAddress = publicKey?.toBase58();

    const handleNetworkSelect = (type: 'evm' | 'solana') => {
        setActiveWalletType(type);
        setShowNetworkSelector(false);
        
        // Open the appropriate wallet modal after setting the network type
        setTimeout(() => {
            if (type === 'evm') {
                openConnectModal?.();
            } else if (type === 'solana') {
                setSolanaModalVisible(true);
            }
        }, 100);
    };

    const formatAddress = (address: string | undefined) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleSolanaAccountClick = () => {
        setShowSolanaAccountModal(true);
    };

    // If not connected, show network selector
    if (!isConnected) {
        return (
            <>
                <Head>
                    <title>Aether</title>
                </Head>
                <div className={`flex ${containerClassName} relative`}>
                    <button 
                        className="h-[34px] px-4 py-[9px] cursor-pointer flex items-center justify-center gradient-bg border-[1px] border-input"
                        onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                    >
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                src={"/icon/wallet.svg"}
                                width={16}
                                height={16}
                                alt="wallet_icon"
                            />
                            <b className={`${isShowAddressInMobile ? 'block' : 'hidden'} md:block text-[12px] text-[#D2D2D2] font-bold`}>
                                Connect Wallet
                            </b>
                        </div>
                    </button>

                    {showNetworkSelector && (
                        <div className="absolute top-full mt-2 right-0 z-50 bg-[#0a0b1a] border border-input rounded-lg shadow-lg p-4 min-w-[250px]">
                            <div className="mb-2 text-sm text-muted-foreground">Select Network:</div>
                            <button
                                onClick={() => handleNetworkSelect('evm')}
                                className="w-full mb-2 p-3 flex items-center gap-3 hover:bg-[#1a1b2a] rounded border border-input transition-colors"
                            >
                                <Image src="/icon/swap/ethereum.svg" width={24} height={24} alt="EVM" />
                                <span className="text-white font-medium">EVM Networks</span>
                            </button>
                            <button
                                onClick={() => handleNetworkSelect('solana')}
                                className="w-full p-3 flex items-center gap-3 hover:bg-[#1a1b2a] rounded border border-input transition-colors"
                            >
                                <Image src="/icon/swap/solana.svg" width={24} height={24} alt="Solana" />
                                <span className="text-white font-medium">Solana Network</span>
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    }

    // Show connected wallet based on active type
    if (activeWalletType === 'solana' && solanaConnected) {
        return (
            <>
                <Head>
                    <title>Aether</title>
                </Head>
                <div className={`flex ${containerClassName}`}>
                    <div className="flex items-center gap-4">
                        {isShowNetwork && (
                            <div className="md:w-[126px] h-[34px] flex items-center justify-start px-4 py-[9px] border-[1px] border-input">
                                <div className="flex flex-row gap-2 items-center">
                                    <Image src="/icon/swap/solana.svg" width={16} height={16} alt="Solana" />
                                    <p className="hidden md:block text-[12px] text-[#D2D2D2]">Solana</p>
                                </div>
                            </div>
                        )}
                        <button 
                            className="md:w-[153px] h-[34px] px-4 py-[9px] cursor-pointer flex items-center justify-center gradient-bg border-[1px] border-input"
                            onClick={handleSolanaAccountClick}
                        >
                            <div className="flex flex-row gap-2 items-center">
                                <Image
                                    src={"/icon/wallet.svg"}
                                    width={16}
                                    height={16}
                                    alt="wallet_icon"
                                />
                                <b className={`${isShowAddressInMobile ? 'block' : 'hidden'} md:block text-[12px] text-[#D2D2D2] font-bold`}>
                                    {formatAddress(solanaAddress)}
                                </b>
                            </div>
                        </button>
                    </div>
                </div>
                
                {/* Solana Account Modal */}
                <SolanaAccountModal
                    isOpen={showSolanaAccountModal}
                    onClose={() => setShowSolanaAccountModal(false)}
                    address={solanaAddress || ''}
                />
            </>
        );
    }

    // Show EVM wallet (using existing RainbowKit)
    if (activeWalletType === 'evm' && evmConnected) {
        return (
            <>
                <Head>
                    <title>Aether</title>
                </Head>
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                    }) => {
                        const ready = mounted && authenticationStatus !== "loading";
                        const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus || authenticationStatus === "authenticated");

                        return (
                            <div className={`flex ${containerClassName}`}>
                                {(() => {
                                    if (!mounted || authenticationStatus === "loading") {
                                        return null;
                                    }

                                    if (!connected) {
                                        return (
                                            <button className="h-[34px] px-4 py-[9px] cursor-pointer flex items-center justify-center gradient-bg border-[1px] border-input" onClick={openConnectModal}>
                                                <div className="flex flex-row gap-2 items-center">
                                                    <Image
                                                        src={"/icon/wallet.svg"}
                                                        width={16}
                                                        height={16}
                                                        alt="wallet_icon"
                                                    />
                                                    <b className={`${isShowAddressInMobile ? 'block' : 'hidden'} md:block text-[12px] text-[#D2D2D2] font-bold`}>
                                                        Connect Wallet
                                                    </b>
                                                </div>
                                            </button>
                                        );
                                    }

                                    if (chain.unsupported) {
                                        return (
                                            <button
                                                onClick={openChainModal}
                                                className={`md:w-[153px] h-[34px] px-4 py-[9px] cursor-pointer flex items-center justify-center gradient-bg border-[1px] border-input ${interTight.className}`}
                                            >
                                                Wrong network
                                            </button>
                                        );
                                    } else {
                                        return (
                                            <div className="flex items-center gap-4">
                                                {isShowNetwork && (
                                                    <div className="md:w-[126px] h-[34px] flex items-center justify-start px-4 py-[9px] border-[1px] border-input cursor-pointer" onClick={openChainModal}>
                                                        <div className="flex flex-row gap-2 items-center">
                                                            <img
                                                                src={chain.iconUrl}
                                                                width={16}
                                                                height={16}
                                                                alt={chain.name}
                                                            />
                                                            <p className="hidden md:block text-[12px] text-[#D2D2D2]">{chain.name}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <button className="md:w-[153px] h-[34px] px-4 py-[9px] cursor-pointer flex items-center justify-center gradient-bg border-[1px] border-input" onClick={openAccountModal}>
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <Image
                                                            src={"/icon/wallet.svg"}
                                                            width={16}
                                                            height={16}
                                                            alt="wallet_icon"
                                                        />
                                                        <b className={`${isShowAddressInMobile ? 'block' : 'hidden'} md:block text-[12px] text-[#D2D2D2] font-bold`}>
                                                            {account.displayName}
                                                        </b>
                                                    </div>
                                                </button>
                                            </div>
                                        )
                                    }
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </>
        );
    }

    return null;
}


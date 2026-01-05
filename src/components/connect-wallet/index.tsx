import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useAccount } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Inter_Tight } from 'next/font/google';
import Image from "next/image";

const interTight = Inter_Tight({
    weight: "700",
    style: "normal",
    preload: false,
});

interface ConnectWalletProps {
    containerClassName?: string
    connectbuttonClassName?: string
    isShowNetwork?: boolean,
    isShowAddressInMobile?: boolean
}

export default function ConnectWallet({
    containerClassName,
    connectbuttonClassName,
    isShowNetwork,
    isShowAddressInMobile
}: ConnectWalletProps) {

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
                                        <button className=" h-[34px]  px-4 py-[9px]  cursor-pointer flex items-center justify-center gradient-bg border-[1px] border-input" onClick={openConnectModal}>
                                            <div className="flex flex-row gap-2 items-center">
                                                <Image
                                                    src={"/icon/wallet.svg"}
                                                    width={16}
                                                    height={16}
                                                    alt="privacy_img"
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
                                            className={`md:w-[153px] h-[34px]  px-4 py-[9px]  cursor-pointer flex items-center justify-center gradient-bg border-[1px] border-input ${interTight.className}`}
                                        >
                                            Wrong network
                                        </button>
                                    );
                                } else {
                                    return (
                                        <div className="flex items-center gap-4">
                                            {isShowNetwork && <div className="md:w-[126px] h-[34px] flex items-center justify-start px-4 py-[9px] border-[1px] border-input" onClick={openChainModal}>
                                                <div className="flex flex-row gap-2 items-center">
                                                    <img
                                                        src={chain.iconUrl}
                                                        width={16}
                                                        height={16}
                                                        alt={chain.name}
                                                    />
                                                    <p className="hidden md:block text-[12px] text-[#D2D2D2]">{chain.name}</p>
                                                </div>
                                            </div>}
                                            <button className="md:w-[153px] h-[34px]  px-4 py-[9px]  cursor-pointer flex items-center justify-center gradient-bg border-[1px] border-input" onClick={openAccountModal}>
                                                <div className="flex flex-row gap-2 items-center">
                                                    <Image
                                                        src={"/icon/wallet.svg"}
                                                        width={16}
                                                        height={16}
                                                        alt="privacy_img"
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

import React, { useState } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletContext } from '@/context/WalletContext';
import { Inter_Tight } from 'next/font/google';

const interTight = Inter_Tight({
    weight: "700",
    style: "normal",
    preload: false,
});

interface SolanaAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: string;
}

export const SolanaAccountModal: React.FC<SolanaAccountModalProps> = ({
    isOpen,
    onClose,
    address,
}) => {
    const { disconnect, wallet } = useWallet();
    const { setActiveWalletType } = useWalletContext();
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleDisconnect = async () => {
        await disconnect();
        setActiveWalletType(null);
        onClose();
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[360px]">
                <div className="bg-[#0a0b1a] border border-input rounded-lg shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-input flex items-center justify-between">
                        <h3 className={`text-white font-bold text-base ${interTight.className}`}>
                            Account
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-white transition-colors"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 4L4 12M4 4L12 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Wallet Info */}
                        <div className="flex items-center gap-3 p-3 bg-[#1a1b2a] rounded border border-input">
                            <Image
                                src="/icon/swap/solana.svg"
                                width={32}
                                height={32}
                                alt="Solana"
                            />
                            <div className="flex-1">
                                <div className="text-xs text-muted-foreground mb-1">
                                    Connected with {wallet?.adapter.name || 'Solana Wallet'}
                                </div>
                                <div className="text-white font-mono text-sm">
                                    {formatAddress(address)}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <button
                                onClick={copyAddress}
                                className="w-full h-[44px] px-4 flex items-center justify-center gap-2 border border-input rounded hover:bg-[#1a1b2a] transition-colors text-white"
                            >
                                {copied ? (
                                    <>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13 4L6 11L3 8"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="text-sm">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5 5V3C5 2.44772 5.44772 2 6 2H13C13.5523 2 14 2.44772 14 3V10C14 10.5523 13.5523 11 13 11H11M5 5H3C2.44772 5 2 5.44772 2 6V13C2 13.5523 2.44772 14 3 14H10C10.5523 14 11 13.5523 11 13V11M5 5H10C10.5523 5 11 5.44772 11 6V11"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="text-sm">Copy Address</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleDisconnect}
                                className="w-full h-[44px] px-4 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 rounded hover:bg-red-500/20 transition-colors text-red-500"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="text-sm font-semibold">Disconnect</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';

export type WalletType = 'evm' | 'solana';

interface WalletContextType {
    activeWalletType: WalletType | null;
    setActiveWalletType: (type: WalletType | null) => void;
    isConnected: boolean;
    address: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
    const [activeWalletType, setActiveWalletType] = useState<WalletType | null>(null);
    
    // EVM wallet state
    const { isConnected: evmConnected, address: evmAddress } = useAccount();
    
    // Solana wallet state
    const { connected: solanaConnected, publicKey } = useWallet();
    const solanaAddress = publicKey?.toBase58() || null;

    // Auto-detect active wallet
    useEffect(() => {
        if (evmConnected && !solanaConnected) {
            setActiveWalletType('evm');
        } else if (solanaConnected && !evmConnected) {
            setActiveWalletType('solana');
        } else if (!evmConnected && !solanaConnected) {
            setActiveWalletType(null);
        }
        // If both are connected, keep the currently active one
    }, [evmConnected, solanaConnected]);

    const isConnected = evmConnected || solanaConnected;
    const address = activeWalletType === 'evm' ? evmAddress || null : solanaAddress;

    return (
        <WalletContext.Provider
            value={{
                activeWalletType,
                setActiveWalletType,
                isConnected,
                address,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWalletContext must be used within a WalletContextProvider');
    }
    return context;
};


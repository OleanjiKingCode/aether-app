import { useAccount } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletContext } from '@/context/WalletContext';

/**
 * A unified hook that provides wallet information for both EVM and Solana chains
 * @returns Unified wallet state and functions
 */
export const useUnifiedWallet = () => {
    const { activeWalletType, setActiveWalletType, isConnected, address } = useWalletContext();
    
    // EVM wallet data
    const { 
        address: evmAddress, 
        isConnected: evmConnected,
        chain: evmChain,
        chainId: evmChainId
    } = useAccount();
    
    // Solana wallet data
    const { 
        publicKey: solanaPublicKey, 
        connected: solanaConnected,
        disconnect: disconnectSolana,
        wallet: solanaWallet
    } = useWallet();
    
    const solanaAddress = solanaPublicKey?.toBase58();

    return {
        // General
        isConnected,
        address,
        activeWalletType,
        setActiveWalletType,
        
        // EVM specific
        evm: {
            isConnected: evmConnected,
            address: evmAddress,
            chain: evmChain,
            chainId: evmChainId
        },
        
        // Solana specific
        solana: {
            isConnected: solanaConnected,
            address: solanaAddress,
            publicKey: solanaPublicKey,
            wallet: solanaWallet,
            disconnect: disconnectSolana
        }
    };
};


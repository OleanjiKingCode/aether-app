import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { IS_TEST_MODE } from '@/config/constant/environment';

// Solana network configuration
export const solanaNetwork = IS_TEST_MODE ? 'devnet' : 'mainnet-beta';
export const solanaRpcEndpoint = IS_TEST_MODE 
    ? clusterApiUrl('devnet')
    : 'https://api.mainnet-beta.solana.com';

// Configure Solana wallets
export const solanaWallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
];


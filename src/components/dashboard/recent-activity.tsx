import Image from "next/image";
import RecentIcon from "public/icon/recent-activity-icon.svg"
import ConnectWallet from "../connect-wallet.tsx";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletContext } from "@/context/WalletContext";
import { IoOpenOutline } from "react-icons/io5";
import { mobulaService } from "@/services/mobula.service";
import Link from "next/link";

const RecentActivity = () => {
    const { address: evmAddress, isConnected: evmConnected } = useAccount();
    const { publicKey, connected: solanaConnected } = useWallet();
    const { activeWalletType, isConnected } = useWalletContext();
    
    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        const fetchActivity = async () => {
            const walletAddress = activeWalletType === 'solana' ? publicKey?.toBase58() : evmAddress;
            
            if (!walletAddress) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                
                // Fetch wallet activity from Mobula API
                const result = await mobulaService.getWalletActivity(walletAddress, {
                    limit: 10,
                    order: 'desc',
                    filterSpam: true,
                    unlistedAssets: false,
                });

                console.log('Wallet activity:', result);

                // Format activity data for display
                const formattedData = result.data.map((activity: any) => {
                    const action = activity.actions[0]; // Get first action
                    const chainId = mobulaService.formatChainId(activity.chainId);
                    
                    // Calculate time ago
                    const timeAgo = getTimeAgo(activity.txDateMs);
                    
                    // Determine type and description
                    let type = 'Transfer';
                    let description = 'Token transfer';
                    let value = '$0';
                    let rate = 'mid';
                    
                    if (action.model === 'swap') {
                        type = 'Swap';
                        const tokenIn = action.swapAssetIn?.symbol || 'Token';
                        const tokenOut = action.swapAssetOut?.symbol || 'Token';
                        description = `Swapped ${tokenIn} to ${tokenOut}`;
                        value = `$${(action.swapAmountUsd || 0).toFixed(2)}`;
                        rate = 'up';
                    } else if (action.model === 'transfer') {
                        if (action.transferType?.includes('VAULT')) {
                            type = 'Stake';
                            description = action.transferType.includes('DEPOSIT') 
                                ? `Staked ${action.transferAsset?.symbol || 'tokens'}`
                                : `Unstaked ${action.transferAsset?.symbol || 'tokens'}`;
                        } else {
                            type = 'Transfer';
                            description = `${action.transferType?.includes('IN') ? 'Received' : 'Sent'} ${action.transferAsset?.symbol || 'tokens'}`;
                        }
                        value = `$${(action.transferAmountUsd || 0).toFixed(2)}`;
                        rate = action.transferType?.includes('IN') ? 'up' : 'down';
                    }

                    return {
                        type,
                        description,
                        time: timeAgo,
                        status: 'Completed',
                        value,
                        action: 'View',
                        rate,
                        txHash: activity.txHash,
                        chainId,
                        link: mobulaService.getExplorerUrl(chainId, activity.txHash),
                    };
                });

                setActivities(formattedData);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch wallet activity:', error);
                setIsLoading(false);
                setActivities([]);
            }
        };

        fetchActivity();
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchActivity, 30000);
        
        return () => clearInterval(interval);
    }, [evmAddress, publicKey, activeWalletType, evmConnected, solanaConnected]);

    // Helper to format time ago
    const getTimeAgo = (timestamp: number): string => {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} min ago`;
        return 'Just now';
    };


    return (
        <div className="p-6 border-input border-[1px] bg-card w-full max-w-250 xl:max-w-full ">
            <div className="flex flex-col items-start gap-1.5">
                <div className="flex flex-row items-center justify-between w-full mb-2">
                    <div className="font-geist-mono font-normal text-base text-foreground">
                        Recent Activity
                    </div>
                    {isConnected && (
                        <div className="hidden sm:flex items-center gap-2">
                            {isLoading ? (
                                <div className="h-9 w-40 rounded skeleton-bg animate-pulse" />
                            ) : (
                                <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-4.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="border border-border pl-8 px-3.5 py-2.5 text-base bg-background focus:outline-none focus:ring-2 focus:ring-primary min-w-[160px]"
                                        style={{ minWidth: 160 }}
                                    />
                                </div>
                            )}
                        </div>)}
                </div>
                <div className="font-geist-mono font-normal text-sm text-muted-foreground">Latest transactions and activities.</div>
                {/* Mobile search input below description */}
                <div className="flex w-full sm:hidden mt-2 mb-2">
                    {isLoading ? (
                        <div className="h-9 w-40 rounded skeleton-bg animate-pulse" />
                    ) : (
                        <div className="relative w-full">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-4.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search"
                                className="border border-border pl-8 px-3.5 py-2.5 text-base bg-background focus:outline-none focus:ring-2 focus:ring-primary w-full"
                            />
                        </div>
                    )}
                </div>
            </div>
            {!isConnected && (<div className="flex flex-col gap-5 w-full items-center justify-center text-center mt-10">
                <div className="rounded-full bg-[#BB3EFF33] w-30 h-30 flex items-center justify-center">
                    <Image src={RecentIcon} alt="" height={64} width={64} />
                </div>
                <div className="flex flex-col gap-1.5 w-full items-center justify-center text-center">
                    <div className="text-foreground text-base font-normal font-geist-mono">
                        Track your transactions
                    </div>
                    <div className="text-sm text-muted-foreground font-geist-mono max-w-[833px]">
                        Once you connect your wallet and start trading, you'll see your recent swaps, staking activities, and cross-chain bridges here in a comprehensive table format.
                    </div>
                </div>
                <div>
                    <ConnectWallet isShowAddressInMobile={true} />
                </div>
            </div>)}
            {isConnected && (
                <div className="flex w-full flex-col mt-6">
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="text-sm text-muted-foreground font-semibold">
                                    <th className="px-3 py-2">Type</th>
                                    <th className="px-3 py-2">Description</th>
                                    <th className="px-3 py-2">Time</th>
                                    <th className="px-3 py-2">Status</th>
                                    <th className="px-3 py-2">Value</th>
                                    <th className="px-3 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    [...Array(5)].map((_, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {[...Array(6)].map((_, i) => (
                                                <td key={i} className="px-3 py-2">
                                                    <div className="h-4 w-20 rounded skeleton-bg animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : activities.length > 0 ? (
                                    activities.map((row, idx) => (
                                        <tr key={idx} className="text-sm border-input border-t-[1px]">
                                            <td className="px-3 py-2">
                                                <div className="flex gap-2 items-center justify-start">
                                                    <Image 
                                                        src={`/icon/recent-${row.type === 'Transfer' ? 'Bridge' : row.type}-icon.svg`} 
                                                        alt={row.type} 
                                                        width={16} 
                                                        height={16}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                    {row.type}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">{row.description}</td>
                                            <td className="px-3 py-2">{row.time}</td>
                                            <td className="px-3 py-2">
                                                <button className="w-25 px-2 py-1 rounded border border-input text-xs bg-background">
                                                    {row.status}
                                                </button>
                                            </td>
                                            <td className={`px-3 py-2 ${row.rate === "up" ? 'text-green-600' : (row.rate === "down" ? 'text-red-600' : 'text-foreground')}`}>
                                                {row.rate === "up" ? '+' : (row.rate === "down" ? '-' : '')}{row.value}
                                            </td>
                                            <td className="px-3 py-2">
                                                <Link 
                                                    href={row.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex gap-2 items-center justify-center hover:text-primary transition-colors"
                                                >
                                                    {row.action} <IoOpenOutline />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                                            No recent activity found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination (shared) */}
                    <div className="flex items-center justify-between w-full mt-4">
                        <div className="text-xs text-muted-foreground font-geist-mono">0 of 5 row(s) selected.</div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 cursor-pointer rounded border border-input text-sm text-muted-foreground bg-background hover:bg-muted transition-colors">Previous</button>
                            <button className="px-3 py-1 rounded border border-input text-sm text-muted-foreground bg-background hover:bg-muted transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecentActivity;

import Divider from "../common/divider"
import DetailAccordion from "./detail-accordion"
import SwapDetail from "./swap-detail"
import MarketInfoIcon from "public/icon/swap/market-info-icon.svg"
import RecentSwapIcon from "public/icon/swap/recent-icon.svg"
import SupportChainIcon from "public/icon/swap/support-network-icon.svg"
import SupportNetworkCard from "./support-network-card"
import EthereumIcon from "public/icon/swap/ethereum.svg"
import SolanaIcon from "public/icon/swap/solana.svg"
import SwapHistoryProtectedIcon from "public/icon/swap/swap-history-protected-icon.svg"
import Image from "next/image"
import { IoArrowForward } from "react-icons/io5";
import { IoOpenOutline } from "react-icons/io5";
import Link from "next/link"
import BaseCard from "../common/base-card"
import Bar from "../common/skeleton/bar"
import { useState, useEffect } from "react"
import { getChains, ChainType } from '@lifi/sdk'


interface DetailProps {
    isLoading?: boolean;
    route?: any;  // Route from LiFi SDK
    fromChain?: any;  // Source chain
    toChain?: any;  // Destination chain
    fromToken?: any;  // Source token
    toToken?: any;  // Destination token
}

const Detail = ({ isLoading, route, fromChain, toChain, fromToken, toToken }: DetailProps) => {
    const [allChains, setAllChains] = useState<any[]>([]);
    const [swapHistory, setSwapHistory] = useState<any[]>([]);
    
    // Fetch all supported chains
    useEffect(() => {
        const fetchChains = async () => {
            try {
                const chains = await getChains({
                    chainTypes: [ChainType.EVM, ChainType.SVM]
                });
                setAllChains(chains);
            } catch (error) {
                console.error('Failed to fetch chains:', error);
            }
        };
        fetchChains();
    }, []);

    // Load swap history from localStorage
    useEffect(() => {
        const loadHistory = () => {
            try {
                const history = JSON.parse(localStorage.getItem('swapHistory') || '[]');
                setSwapHistory(history);
            } catch (error) {
                console.error('Failed to load swap history:', error);
                setSwapHistory([]);
            }
        };
        loadHistory();
        
        // Listen for storage changes to update history in real-time
        const handleStorageChange = () => {
            loadHistory();
        };
        window.addEventListener('storage', handleStorageChange);
        
        // Also check every 2 seconds for updates from current tab
        const interval = setInterval(loadHistory, 2000);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // Determine network display based on chains
    const getNetworkDisplay = () => {
        if (fromChain && toChain) {
            if (fromChain.id === toChain.id) {
                return `Same-chain (${fromChain.name})`;
            }
            return `Cross-chain (bridge required)`;
        }
        return "Cross-chain (bridge required)";
    };

    // Get chain color for icon background
    const getChainColor = (chainId: number) => {
        const colorMap: { [key: number]: string } = {
            1: 'bg-blue-600',      // Ethereum
            56: 'bg-yellow-500',   // BSC
            137: 'bg-purple-600',  // Polygon
            42161: 'bg-blue-500', // Arbitrum
            10: 'bg-red-500',     // Optimism
            250: 'bg-blue-400',   // Fantom
            43114: 'bg-red-600',  // Avalanche
            101: 'bg-purple-500', // Solana (legacy)
            1151111081099710: 'bg-purple-500', // Solana (LI.FI chain ID)
        };
        return colorMap[chainId] || 'bg-gray-600';
    };


    // Use real token data from selected tokens or fallback to default
    const martetInfo = {
        "token1_price": fromToken?.priceUSD ? parseFloat(fromToken.priceUSD) : 2400.5,
        "token1_symbol": fromToken?.symbol || "ETH",
        "token1_24_change": Math.abs(fromToken?.priceChange24h || 5.4),
        "token1_state": (fromToken?.priceChange24h || 0) >= 0 ? "up" : "down",
        "token2_price": toToken?.priceUSD ? parseFloat(toToken.priceUSD) : 3.5,
        "token2_symbol": toToken?.symbol || "Token",
        "token2_24_change": Math.abs(toToken?.priceChange24h || 0),
        "token2_state": (toToken?.priceChange24h || 0) >= 0 ? "up" : "down",
    }

    // Format swap history for display
    const recentSwapHistory = swapHistory.map((swap) => {
        const date = new Date(swap.timestamp);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        
        // Calculate total price (simplified - would need token prices)
        const totalPrice = parseFloat(swap.fromAmount) * 2400; // Mock price calculation
        
        // Get chain info for explorer link
        const getExplorerLink = (chainId: number, txHash: string) => {
            // Solana chain IDs
            const SOLANA_CHAIN_ID = 1151111081099710;
            const isSolana = chainId === SOLANA_CHAIN_ID || chainId === 101;
            
            if (isSolana) {
                return `https://solscan.io/tx/${txHash}`;
            }
            
            const explorers: { [key: number]: string } = {
                1: `https://etherscan.io/tx/${txHash}`,
                56: `https://bscscan.com/tx/${txHash}`,
                137: `https://polygonscan.com/tx/${txHash}`,
                42161: `https://arbiscan.io/tx/${txHash}`,
                10: `https://optimistic.etherscan.io/tx/${txHash}`,
            };
            return explorers[chainId] || '#';
        };
        
        return {
            token1_symbol: swap.fromToken,
            token2_symbol: swap.toToken,
            token1_amount: parseFloat(swap.fromAmount).toFixed(4),
            token2_amount: parseFloat(swap.toAmount).toFixed(4),
            total_price: totalPrice.toFixed(2),
            date: formattedDate,
            swap_type: swap.fromChain === swap.toChain ? 'Same-Chain Swap' : 'Cross-Chain Swap',
            isProtected: swap.isProtected || false,
            transaction_link: getExplorerLink(swap.fromChain, swap.transactionHash)
        };
    });

    return (
        <div className="flex flex-col gap-6 w-full">
            <SwapDetail 
                isLoading={isLoading} 
                isProtection={true} 
                isSmartRouting={true} 
                network={getNetworkDisplay()} 
                hasRoute={!!route}
            />

            <DetailAccordion isLoading={isLoading} icon={MarketInfoIcon} title="Market Info">
                <div className="flex flex-col gap-2.5 mb-2.5">
                    <div className="flex justify-between">
                        {isLoading && <Bar barClassName="w-17 h-2.5" />}
                        {!isLoading && (<div className="text-xs text-muted-foreground">{martetInfo["token1_symbol"]} Price</div>)}

                        {isLoading && <Bar barClassName="w-12.5 h-2.5" />}
                        {!isLoading && <div className="text-xs text-muted-foreground">${martetInfo["token1_price"].toLocaleString('en-US')}</div>}
                    </div>
                    <div className="flex justify-between">
                        {isLoading && <Bar barClassName="w-17 h-2.5" />}
                        {!isLoading && (<div className="text-xs text-muted-foreground">24h Change</div>)}

                        {isLoading && <Bar barClassName="w-12.5 h-2.5" />}
                        {!isLoading && <div className={`text-xs ${martetInfo["token1_state"] === "up" ? "text-green-500" : "text-red-500"}`}>{martetInfo["token1_state"] === "up" ? "+" : "-"}  {martetInfo["token1_24_change"].toLocaleString('en-US')}</div>}
                    </div>
                    <Divider />
                    <div className="flex justify-between">
                        {isLoading && <Bar barClassName="w-17 h-2.5" />}
                        {!isLoading && (
                            <div className="text-xs text-muted-foreground">{martetInfo["token2_symbol"]} Price</div>
                        )}

                        {isLoading && <Bar barClassName="w-12.5 h-2.5" />}
                        {!isLoading && (
                            <div className="text-xs text-muted-foreground">${martetInfo["token2_price"].toLocaleString('en-US')}</div>
                        )}
                    </div>
                    <div className="flex justify-between">
                        {isLoading && <Bar barClassName="w-17 h-2.5" />}
                        {!isLoading && (
                            <div className="text-xs text-muted-foreground">24h Change</div>
                        )}
                        {isLoading && <Bar barClassName="w-12.5 h-2.5" />}
                        {!isLoading && (
                            <div className={`text-xs ${martetInfo["token2_state"] === "up" ? "text-green-500" : "text-red-500"}`}>{martetInfo["token2_state"] === "up" ? "+" : "-"}  {martetInfo["token2_24_change"].toLocaleString('en-US')}</div>
                        )}
                    </div>
                </div>
            </DetailAccordion >

            <DetailAccordion isLoading={isLoading} icon={SupportChainIcon} title="Supported Networks">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        {isLoading && <Bar barClassName="w-full h-2.5" />}
                        {!isLoading && allChains.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                                Currently supporting {allChains.length} networks across EVM and Solana.
                            </div>
                        )}
                        {!isLoading && allChains.length === 0 && (
                            <div className="text-xs text-muted-foreground">Loading supported networks...</div>
                        )}
                        
                        {/* Display top networks */}
                        {!isLoading && allChains.slice(0, 6).map((chain) => {
                            const getFeeRange = (chainId: number) => {
                                const feeMap: { [key: number]: string } = {
                                    1: '$15-50',      // Ethereum
                                    56: '$0.10-0.50', // BSC
                                    137: '$0.01-0.10', // Polygon
                                    42161: '$0.10-1', // Arbitrum
                                    10: '$0.10-1',   // Optimism
                                    250: '$0.01-0.10', // Fantom
                                    43114: '$0.50-2', // Avalanche
                                    101: '$0.01',     // Solana (legacy)
                                    1151111081099710: '$0.01', // Solana (LI.FI chain ID)
                                };
                                return feeMap[chainId] || '$0.01-1';
                            };

                            const getDescription = (chainId: number) => {
                                const descMap: { [key: number]: string } = {
                                    1: 'High security, established DeFi',
                                    56: 'Fast and low-cost transactions',
                                    137: 'Scalable and efficient',
                                    42161: 'Layer 2 scaling solution',
                                    10: 'Optimistic rollup technology',
                                    250: 'High-speed DeFi platform',
                                    43114: 'Fast, low cost, Solidity',
                                    101: 'Ultra-fast, low fees',
                                    1151111081099710: 'Ultra-fast, low fees', // Solana (LI.FI chain ID)
                                };
                                return descMap[chainId] || 'Cross-chain compatible';
                            };

                            return (
                                <div key={chain.id} className="border border-input bg-background px-3 py-2 rounded flex items-center gap-3">
                                    <div className={`${getChainColor(chain.id)} w-8 h-8 px-1 flex justify-center items-center rounded-full`}>
                                        {chain.logoURI ? (
                                            <img src={chain.logoURI} alt={chain.name} className="w-5 h-5" />
                                        ) : (
                                            <div className="text-white text-xs font-bold">{chain.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-foreground">{chain.name}</div>
                                        <div className="text-xs text-muted-foreground">{getDescription(chain.id)}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-xs text-green-500 font-medium">Active</div>
                                        <div className="text-xs text-muted-foreground">{getFeeRange(chain.id)}</div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {!isLoading && allChains.length > 6 && (
                            <div className="text-xs text-muted-foreground text-center">
                                + {allChains.length - 6} more networks supported
                            </div>
                        )}
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-2.5">
                        {isLoading && <Bar barClassName="w-full h-2.5" />}
                        {!isLoading && <div className="text-xs text-muted-foreground text-center">Current Configuration</div>}
                        
                        {!isLoading && fromChain && toChain ? (
                            <div className="border border-border bg-[#FB9B000D] px-4 py-3 flex flex-col gap-2">
                                <div className="flex gap-2 items-center justify-center">
                                    <div className="flex gap-1 items-center">
                                        <div className={`${getChainColor(fromChain.id)} w-6 h-6 px-1 flex justify-center items-center rounded-full`}>
                                            {fromChain.logoURI ? (
                                                <img src={fromChain.logoURI} alt={fromChain.name} className="w-4 h-4" />
                                            ) : (
                                                <div className="text-white text-xs font-bold">{fromChain.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-medium">{fromChain.name}</div>
                                    </div>
                                    <IoArrowForward className="text-secondary" />
                                    <div className="flex gap-1 items-center">
                                        <div className={`${getChainColor(toChain.id)} w-6 h-6 px-1 flex justify-center items-center rounded-full`}>
                                            {toChain.logoURI ? (
                                                <img src={toChain.logoURI} alt={toChain.name} className="w-4 h-4" />
                                            ) : (
                                                <div className="text-white text-xs font-bold">{toChain.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-medium">{toChain.name}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 items-center">
                                    {fromChain.id !== toChain.id && (
                                        <>
                                            <div className="text-xs text-muted-foreground">Cross-Chain Bridge</div>
                                            <div className="text-xs text-muted-foreground font-medium">AetherDex</div>
                                        </>
                                    )}
                                    {fromChain.id === toChain.id && (
                                        <div className="text-xs text-muted-foreground">Same-Chain Swap</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="border border-border bg-[#FB9B000D] px-4 py-3 flex flex-col gap-2">
                                <div className="text-xs text-muted-foreground text-center">
                                    Select tokens to see configuration
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Divider />
                        <div className="flex justify-between">
                            {isLoading && <Bar barClassName="w-40 h-3" />}
                            {!isLoading && <div className="text-xs text-muted-foreground">Ethereum Gas (Gwei)</div>}
                            {isLoading && <Bar barClassName="w-16 h-3" />}
                            {!isLoading && <div className="text-xs text-muted-foreground">36.5</div>}
                        </div>
                    </div>
                </div>
            </DetailAccordion>
            <DetailAccordion isLoading={isLoading} icon={RecentSwapIcon} title="Recent Swaps">
                <div className="flex flex-col gap-2.5 mb-2.5">
                    {swapHistory.length === 0 && !isLoading && (
                        <div className="text-xs text-muted-foreground text-center py-4">
                            No swap history yet. Complete your first swap to see it here!
                        </div>
                    )}
                    {isLoading && (<BaseCard className="flex justify-between px-3 py-2.5">
                        <div className="flex gap-2 items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-3">
                                    <div className="flex gap-3">

                                        <Bar barClassName="w-20 h-3" />
                                        <IoArrowForward />
                                        <Bar barClassName="w-20 h-3" />
                                    </div>
                                    <Bar barClassName="w-40 h-3" />
                                </div>
                                <Bar barClassName="w-40 h-3" />

                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1">
                                <Bar barClassName="w-20 h-3" />
                                <Bar barClassName="w-20 h-3" />
                            </div>
                            <Bar barClassName="w-5 h-5" />

                        </div>
                    </BaseCard>)}
                    {!isLoading && recentSwapHistory.map((row, index) => {
                        return (
                            <BaseCard className="flex justify-between px-3 py-2.5">
                                <div className="flex gap-2 items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-3">
                                            <div className="flex gap-3">
                                                <div className="text-xs text-foreground">
                                                    {row.token1_amount}&nbsp;{row.token1_symbol}
                                                </div>
                                                <IoArrowForward />
                                                <div className="text-xs text-foreground">
                                                    {row.token2_amount}&nbsp;{row.token2_symbol}
                                                </div>
                                            </div>
                                            {row.isProtected && (
                                                <div className="flex items-center justify-center bg-muted border border-input p-1">
                                                    <Image src={SwapHistoryProtectedIcon} width={12} height={12} alt="" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {row.swap_type}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs text-muted-foreground">{row.total_price}</div>
                                        <div className="text-xs text-muted-foreground">{row.date}</div>
                                    </div>
                                    <Link href={row.transaction_link}> <IoOpenOutline /></Link>
                                </div>
                            </BaseCard>
                        )
                    })}
                </div>
            </DetailAccordion>
        </div >
    )
}

export default Detail
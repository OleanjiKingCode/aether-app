import Image from "next/image";
import RecentIcon from "public/icon/recent-activity-icon.svg"
import ConnectWallet from "../connect-wallet.tsx";
import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletContext } from "@/context/WalletContext";
import { IoArrowUpSharp } from "react-icons/io5";
import { IoArrowDown } from "react-icons/io5";
import { Progressbar } from "../common/progresbar";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoInformationCircleOutline } from "react-icons/io5";
import TokenDetailModal from "../common/modals/token-detail-modal";
import SetPriceAlertModal from "../common/modals/set-price-alert-modal";
import { mobulaService } from "@/services/mobula.service";

const PortfolioHolders = () => {
    const { address: evmAddress, isConnected: evmConnected } = useAccount();
    const { publicKey, connected: solanaConnected } = useWallet();
    const { activeWalletType, isConnected } = useWalletContext();

    const [isTokenDetailModalOpen, setIsTokenDetailModalOpen] = useState(false)
    const [isSetPriceAlertModalOpen, setIsSetPriceAlertModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [holdings, setHoldings] = useState<any[]>([]);
    const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHoldings = async () => {
            const walletAddress = activeWalletType === 'solana' ? publicKey?.toBase58() : evmAddress;
            
            if (!walletAddress) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                
                // Fetch portfolio data from Mobula API
                const portfolio = await mobulaService.getWalletPortfolio(walletAddress, {
                    cache: true,
                    stale: 60,
                });

                console.log('Portfolio holdings:', portfolio);

                const validAssets = (portfolio.assets || []).filter(asset => asset.estimated_balance > 0);

                // Format holdings data
                const formattedHoldings = validAssets.map(asset => {
                    // Get primary chain from cross_chain_balances
                    const primaryChain = asset.cross_chain_balances 
                        ? Object.keys(asset.cross_chain_balances)[0] 
                        : 'Unknown';
                    
                    // Calculate P&L
                    const priceChange = asset.price_change_24h || 0;
                    const pnl = (asset.estimated_balance * priceChange) / 100;

                    return {
                        asset: {
                            symbol: asset.asset?.symbol || 'Unknown',
                            name: asset.asset?.name || 'Unknown Token',
                            logo: asset.asset?.logo
                        },
                        category: 'Token', // Could be enhanced with token categorization
                        chain: primaryChain,
                        balance: asset.token_balance,
                        value: asset.estimated_balance,
                        changed_24hrs: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
                        rate: priceChange >= 0 ? 'up' : 'down',
                        ratePL: pnl >= 0 ? 'up' : 'down',
                        PL: Math.abs(pnl),
                        allocation: asset.allocation,
                        actions: "Swap",
                    };
                });

                setHoldings(formattedHoldings);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch holdings:', error);
                setIsLoading(false);
                setHoldings([]);
            }
        };

        fetchHoldings();
    }, [evmAddress, publicKey, activeWalletType, evmConnected, solanaConnected]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpenDropdownIdx(null);
            }
        }
        if (openDropdownIdx !== null) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [openDropdownIdx]);

    const tableData = holdings;
    const bgColors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray'];

    return (
        <div className="p-6 border-input border-[1px] bg-card w-full max-w-250 xl:max-w-full ">
            <div className="flex flex-col items-start gap-1.5">
                <div className="flex flex-row items-center justify-between w-full mb-2">
                    <div className="font-geist-mono font-normal text-base text-foreground">
                        Holdings
                    </div>
                    {isConnected && (
                        <div className="hidden sm:flex items-center gap-2">
                            {isLoading ? (
                                <div className="h-9 w-40 rounded skeleton-bg animate-pulse" />
                            ) : (
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="border border-border px-3.5 py-2.5 text-base bg-background  min-w-[160px] text-muted-foreground"
                                        style={{ minWidth: 160 }}
                                    >
                                        Show hidden (0)
                                    </button>
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
                    <Image src={RecentIcon.src} alt="" height={64} width={64} />
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
                <div className="flex w-full flex-col mt-6 relative">
                    <div className="overflow-x-auto w-full overflow-visible">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="text-sm text-muted-foreground font-semibold">
                                    <th className="px-3 py-2">Asset</th>
                                    <th className="px-3 py-2">Category</th>
                                    <th className="px-3 py-2">Chain</th>
                                    <th className="px-3 py-2">Balance</th>
                                    <th className="px-3 py-2">Value (USD)</th>
                                    <th className="px-3 py-2">24h Change</th>
                                    <th className="px-3 py-2">P&L</th>
                                    <th className="px-3 py-2">Allocation</th>
                                    <th className="px-3 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="overflow-visible">
                                {isLoading ? (
                                    [...Array(5)].map((_, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {[...Array(9)].map((_, i) => (
                                                <td key={i} className="px-3 py-2">
                                                    <div className="h-4 w-20 rounded skeleton-bg animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : tableData.length > 0 ? (
                                    tableData.map((row, idx) => (
                                        <tr key={idx} className="text-sm border-input border-t-[1px]">
                                            <td className="px-3 py-2">
                                                <div className="flex gap-2 items-center justify-start">
                                                    {row.asset.logo ? (
                                                        <img 
                                                            src={row.asset.logo} 
                                                            alt={row.asset.symbol}
                                                            className="w-6 h-6 rounded-full"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-${bgColors[idx % bgColors.length]}-500`}>
                                                            <div className="text-white font-semibold text-xs">{row.asset.symbol.charAt(0)}</div>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <div className="text-xs font-medium">{row.asset.symbol}</div>
                                                        <div className="text-[10px] text-muted-foreground">{row.asset.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2"><button className="w-25 px-2 py-1 rounded border border-input text-xs bg-background">{row.category}</button></td>
                                            <td className="px-3 py-2">{row.chain}</td>
                                            <td className="px-3 py-2">
                                                {parseFloat(row.balance.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex gap-2 items-center justify-center">${row.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                            </td>
                                            <td className={`px-3 py-2 ${row.rate === "up" ? 'text-green-600' : (row.rate === "down" ? 'text-red-600' : 'text-foreground')}`}>
                                                <div className="flex gap-1.5 items-center">{row.rate === "up" ? <IoArrowUpSharp className="rotate-45" /> : (row.rate === "down" ? <IoArrowDown className="rotate-45" /> : '')}{row.changed_24hrs}</div>
                                            </td>
                                            <td className={`px-3 py-2 ${row.ratePL === "up" ? 'text-green-600' : (row.ratePL === "down" ? 'text-red-600' : 'text-foreground')}`}>
                                                <div className="flex gap-1.5 items-center">{row.ratePL === "up" ? '+' : '-'}${row.PL.toFixed(2)}</div>
                                            </td>
                                            <td className="px-3 py-2 flex items-center">
                                                <Progressbar min={0} max={100} now={row.allocation} color={`bg-${bgColors[idx % bgColors.length]}-500`} containerClass={`rounded-none !h-[11px] !border-none`} />
                                                <div>{row.allocation.toFixed(1) + '%'}</div>
                                            </td>
                                            <td className="px-3 py-2 relative">
                                                <div className="flex gap-2 items-end justify-end">
                                                    {row.actions}
                                                    <button
                                                        className="p-1"
                                                        onClick={() =>
                                                            setOpenDropdownIdx(openDropdownIdx === idx ? null : idx)
                                                        }
                                                    >
                                                        <IoEllipsisHorizontalSharp />
                                                    </button>
                                                    {openDropdownIdx === idx && (
                                                        <div
                                                            ref={dropdownRef}
                                                            className={`absolute right-0 ${idx === 0 ? 'top-0' : 'bottom-0'} mb-2 z-[999] bg-background border border-input rounded shadow-lg w-50 py-2`}
                                                        >
                                                            <button className="flex items-center gap-2.5 w-full text-left px-4 py-2 hover:bg-muted text-sm" onClick={() => {
                                                                setOpenDropdownIdx(null)
                                                                setIsTokenDetailModalOpen(true)
                                                            }}>
                                                                <IoInformationCircleOutline />View Details
                                                            </button>
                                                            <button className="flex items-center gap-2.5 w-full text-left px-4 py-2 hover:bg-muted text-sm" onClick={() => {
                                                                setOpenDropdownIdx(null)
                                                                setIsSetPriceAlertModal(true)
                                                            }}>
                                                                <IoNotificationsOutline /> Set Price Alert
                                                            </button>
                                                            <button className="w-full text-left px-4 py-2 hover:bg-muted text-sm flex items-center gap-2.5" onClick={() => setOpenDropdownIdx(null)}>
                                                                <IoEyeOffOutline /> Hide Token
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="px-3 py-8 text-center text-muted-foreground">
                                            No holdings found
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
            <TokenDetailModal isOpen={isTokenDetailModalOpen} setIsOpen={setIsTokenDetailModalOpen} />
            <SetPriceAlertModal isOpen={isSetPriceAlertModalOpen} setIsOpen={setIsSetPriceAlertModal} />
        </div>
    )
}

export default PortfolioHolders;

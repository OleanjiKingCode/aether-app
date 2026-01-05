import Image from "next/image";
import ChartIcon from "public/icon/Pie-Chart-Icon.svg"
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletContext } from "@/context/WalletContext";
import { Cell, Pie, PieChart } from 'recharts';
import React, { useEffect, useState } from "react";
import { mobulaService } from "@/services/mobula.service";

const PortfolioAllocation = () => {
    const { address: evmAddress, isConnected: evmConnected } = useAccount();
    const { publicKey, connected: solanaConnected } = useWallet();
    const { activeWalletType, isConnected } = useWalletContext();
    
    const [isLoading, setIsLoading] = useState(true);
    const [portfolioData, setPortfolioData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    
    const COLORS = ['#AD46FF', '#F6339A', '#FB9B00', '#00B8DB', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

    useEffect(() => {
        const fetchPortfolioAllocation = async () => {
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

                console.log('Portfolio allocation data:', portfolio);

                if (portfolio.assets && Array.isArray(portfolio.assets)) {
                    // Get top assets by USD value (top 8 for the chart)
                    const sortedAssets = portfolio.assets
                        .filter(asset => asset.estimated_balance > 0)
                        .sort((a, b) => b.estimated_balance - a.estimated_balance)
                        .slice(0, 8);

                    console.log('Sorted assets for chart:', sortedAssets);

                    // Format for chart
                    const chartData = sortedAssets.map(asset => ({
                        name: asset.asset?.symbol || 'Unknown',
                        value: asset.estimated_balance,
                        balance: asset.token_balance,
                        price: asset.price,
                        allocation: asset.allocation,
                    }));

                    const totalValue = sortedAssets.reduce((sum, asset) => sum + asset.estimated_balance, 0);

                    setPortfolioData(chartData);
                    setTotal(totalValue);
                } else {
                    setPortfolioData([]);
                    setTotal(0);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch portfolio allocation:', error);
                setIsLoading(false);
                setPortfolioData([]);
                setTotal(0);
            }
        };

        fetchPortfolioAllocation();
    }, [evmAddress, publicKey, activeWalletType, evmConnected, solanaConnected]);

    return (
        <div className="p-6 border-input border-[1px] bg-card  w-full max-w-250 xl:max-w-full xl:w-125">
            <div className="flex items-center gap-1.5">
                <div className="">
                    <Image src={ChartIcon} alt="" height={15} width={15} />
                </div>
                <div className="font-geist-mono font-semibold text-base text-foreground">
                    Portfolio Allocation
                </div>
            </div>
            {isConnected && (
                <div className="flex flex-col justify-center items-center w-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center" style={{ width: 320, height: 200 }}>
                            <svg width="320" height="200" viewBox="0 0 320 200">
                                <defs>
                                    <pattern id="skeleton-bg-pattern" patternUnits="userSpaceOnUse" width="320" height="200">
                                        <rect width="320" height="200" className="skeleton-bg" />
                                    </pattern>
                                </defs>
                                <path
                                    d="M80,150 A80,80 0 0,1 240,150 L212,150 A60,60 0 0,0 108,150 Z"
                                    fill="url(#skeleton-bg-pattern)" className="animate-pulse" opacity="0.5"
                                />
                            </svg>
                        </div>
                    ) : portfolioData.length > 0 ? (
                        <>
                            <PieChart width={320} height={200}>
                                <Pie
                                    data={portfolioData}
                                    cx={160}
                                    cy={150}
                                    width={200}
                                    height={200}
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#010314"
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="#010314"
                                >
                                    {portfolioData.map((entry, index) => (
                                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                            {portfolioData.map((row, index) => {
                                const percentage = total > 0 ? (row.value * 100 / total) : 0;
                                return (
                                    <div key={index} className="flex justify-between w-50 items-center">
                                        <div className="flex gap-4 items-center">
                                            <div 
                                                className={`w-3 h-3 border-2 rounded-full`}
                                                style={{ borderColor: COLORS[index % COLORS.length] }}
                                            />
                                            <div className="text-muted-foreground text-base font-semibold">
                                                {row.name}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-base font-semibold">
                                                {percentage.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <div className="text-xs text-muted-foreground text-center py-8">
                            No assets found in your portfolio
                        </div>
                    )}

                </div>
            )}
            {!isConnected && (<div className="flex flex-col gap-5 w-full items-center justify-center text-center mt-[30px]">

                <div className="rounded-full bg-[#99774033] w-30 h-30 flex items-center justify-center">
                    <Image src={ChartIcon} alt="" height={64} width={64} />
                </div>
                <div className="flex flex-col gap-1.5 w-full items-center justify-center text-center">
                    <div className="text-foreground text-base font-normal font-geist-mono">
                        Portfolio Distribution
                    </div>
                    <div className="text-sm text-muted-foreground font-geist-mono">
                        Conect wallet to view allocation breakdown
                    </div>
                </div>
            </div>)}
        </div>
    )
}

export default PortfolioAllocation;
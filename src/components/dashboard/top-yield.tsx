import Image from "next/image";
import TopYieldIcon from "public/icon/top-yield-Icon.svg"
import { IoTrendingUp, IoOpenOutline } from "react-icons/io5";
import InfoCard from "./info-card";
import { useState } from "react";
import { birdeyeService } from "@/services/birdeye.service";
import { useRouter } from "next/router";
import Link from "next/link";

const topYieldData = [
    {
        title: "AETH-ETH",
        content: "AetherVault",
        rate: <div className="text-sm text-green-600">22.1%</div>,
        rateDescription: "Low risk",
        description: <div className="flex gap-2 items-center"><div className="text-xs text-muted-foreground font-geist-mono">TVL: $2.4M</div><div className="border-[1px] border-input px-3 py-0 md:py-2 bg-background text-[8px] sm:text-xs text-muted-foreground font-geist-mono">Auto-compound</div></div>
    },
    {
        title: "RNDR-USDC",
        content: "DeepFarm",
        rate: <div className="text-sm text-green-600">18.1%</div>,
        rateDescription: "Medium risk",
        description: <div className="flex gap-2 items-center"><div className="text-xs text-muted-foreground font-geist-mono">TVL: $80k</div><div className="border-[1px] border-input px-3 py-0 md:py-2 bg-background text-[8px] sm:text-xs text-muted-foreground font-geist-mono">Weekly rewards</div></div>

    },
    {
        title: "FET-SOL",
        content: "ChainYield",
        rate: <div className="text-sm text-green-600">15.1%</div>,
        rateDescription: "Low risk",
        description: <div className="flex gap-2 items-center"><div className="text-xs text-muted-foreground font-geist-mono">TVL: $1.2M</div><div className="border-[1px] border-input px-3 py-0 md:py-2 bg-background text-[8px] sm:text-xs text-muted-foreground font-geist-mono">Cross-chain</div></div>

    },
];

interface TopYieldProps {
    trendingTokens: any[];
    isLoading: boolean;
}

const TopYield = ({ trendingTokens, isLoading }: TopYieldProps) => {
    const router = useRouter();
    const [range, setRange] = useState('24H');

    // Handle token click - navigate to swap page with Jupiter
    const handleTokenClick = (token: any) => {
        // Store token data for swap page to use Jupiter
        localStorage.setItem('swapPrefill', JSON.stringify({
            fromToken: 'SOL',
            fromTokenAddress: 'So11111111111111111111111111111111111111112',
            toTokenAddress: token.address,
            toTokenSymbol: token.symbol,
            chain: 'solana',
            useJupiter: true  // Signal to use Jupiter instead of LI.FI
        }));
        
        // Navigate to swap page
        router.push('/swap');
    };

    // Build AI Trading Signals with real trending data (use first 3 tokens)
    const AITradingData = trendingTokens.length > 0 
        ? trendingTokens.slice(0, 3).map((token, idx) => {
            const priceChange = token.priceChange24h;
            const isPositive = priceChange > 0;
            const signal = isPositive ? 'DYOR' : 'Hold';
            const confidence = Math.min(95, 70 + Math.abs(priceChange));
            const targetPrice = token.price * (1 + (priceChange / 100) * 0.5);
            
            return {
                title: <div className="flex items-center gap-2">
                    {token.logoURI ? (
                        <img 
                            src={token.logoURI} 
                            alt={token.symbol}
                            className="w-5 h-5 rounded-full"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                            {token.symbol.charAt(0)}
                        </div>
                    )}
                    {token.symbol}
                </div>,
                content: <div className="flex flex-col gap-1">
                    <div className="text-xs font-geist-mono">24h Vol: {birdeyeService.formatNumber(token.volume24h)}</div>
                    <div className="text-xs font-geist-mono">Liquidity: {birdeyeService.formatNumber(token.liquidity)}</div>
                    <div className="text-xs font-geist-mono">MCap: {birdeyeService.formatNumber(token.marketCap)}</div>
                    <div className="flex items-center gap-2">
                        <div className="text-[10px] font-geist-mono text-muted-foreground/50 truncate max-w-[150px]" title={token.address}>
                            {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
                        </div>
                        <Link 
                            href={`https://dexscreener.com/solana/${token.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <IoOpenOutline size={12} />
                        </Link>
                    </div>
                </div>,
                rate: <div className={`${isPositive ? 'border-green-600 bg-[#00C95133] text-green-600' : 'border-red-600 bg-[#E7000B33] text-red-600'} border-[1px] px-3 py-0 text-[8px] sm:text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                    onClick={() => handleTokenClick(token)}
                >
                    {signal}
                </div>,
                rateDescription: `${confidence.toFixed(0)}% conf.`,
                description: <div className="flex gap-2 items-center"><div className="text-xs text-muted-foreground font-geist-mono">Target: ${targetPrice.toFixed(4)}</div></div>
            };
        })
        : [
    {
        title: "RNDR",
        content: "1-2 weeks",
        rate: <div className="border-green-600 border-[1px] px-3 py-0 text-[8px] sm:text-xs bg-[#00C95133] text-green-600">DYOR</div>,
        rateDescription: "92% conf.",
        description: <div className="flex gap-2 items-center"><div className="text-xs text-muted-foreground font-geist-mono">Target: $5.20</div></div>
    },
    {
        title: "FET",
        content: "2-4 weeks",
        rate: <div className="border-border text-center border-[1px] px-3 py-0 text-[8px] sm:text-xs bg-[#FB9B0033] text-secondary">Hold</div>,
        rateDescription: "78% conf.",
        description: <div className="flex gap-2 items-center"><div className="text-xs text-muted-foreground font-geist-mono">Target: $1.05</div></div>
    },
    {
        title: "TAO",
        content: "3-6 weeks",
        rate: <div className="border-red-600 text-center border-[1px] px-3 py-0 text-[8px] sm:text-xs bg-[#E7000B33] text-red-600">Weak Buy</div>,
        rateDescription: "65% conf.",
        description: <div className="flex gap-2 items-center"><div className="text-xs text-muted-foreground font-geist-mono">Target: $280</div></div>
            }
        ];
    return (
        <div className="p-6 border-input border-[1px] bg-card w-full max-w-250 xl:max-w-full ">
            <div className="flex items-center gap-1.5">
                <div className="">
                    <Image src={TopYieldIcon.src} alt="" height={20} width={20} />
                </div>
                <div className="font-geist-mono font-semibold text-base text-foreground">
                AI Trading Signals 
                </div>
            </div>
            <div className="flex flex-col gap-5 w-full overflow-x-auto mt-[30px] pb-2">
                {AITradingData.map((item, idx) => (
                    <InfoCard isLoading={isLoading} key={idx} {...item} />
                ))}
            </div>
            <div className="my-5 border-t border-input w-full" />
            <div className="flex items-center gap-1.5">
                <div className="">
                    <IoTrendingUp size={20} color="#00a63e" />
                </div>
                <div className="font-geist-mono font-semibold text-base text-foreground">
                    Top yield Opportunities
                </div>
            </div>
            <div className="flex flex-col gap-5 w-full overflow-x-auto mt-[30px] pb-2">
                {topYieldData.map((item: any, idx) => (
                    <InfoCard isLoading={isLoading} key={idx} {...item} />
                ))}
            </div>
        </div>
    )
}

export default TopYield;
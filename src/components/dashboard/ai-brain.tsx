import Image from "next/image";
import AIBrainIcon from "public/icon/AI-Brain-Icon.svg"
import InfoCard from "./info-card";
import AI1Icon from "public/icon/ai-1-icon.svg"
import AI2Icon from "public/icon/ai-2-icon.svg"
import AI3Icon from "public/icon/ai-3-icon.svg"
import AI4Icon from "public/icon/ai-4-icon.svg"
import AI5Icon from "public/icon/ai-5-icon.svg"
import AI6Icon from "public/icon/ai-6-icon.svg"
import { IoArrowForward } from "react-icons/io5";
import { birdeyeService } from "@/services/birdeye.service";
import { useRouter } from "next/router";

interface AIBrainProps {
    trendingTokens: any[];
    isLoading: boolean;
}

const AIBrain = ({ trendingTokens, isLoading }: AIBrainProps) => {
    const router = useRouter();

    // Handle "Take Action" click - navigate to swap page with Jupiter
    const handleTakeAction = (token: any) => {
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

    // Build AI insights with real trending data
    const AITradingData = [
        {
            icon: AI1Icon,
            title: "Stake AETH for 15.2% APY",
            content: "Your 2,450 AETH could earn $312/month",
            rate: <div className="border-green-600 border-[1px] px-3 py-0 text-[8px] md:text-xs bg-[#00C95133] text-green-600">10.2% APY</div>,
            rateDescription: "   ",
            description: <div className="flex gap-1 py-2.5 items-center"><div className="text-xs text-muted-foreground">Take Action</div><IoArrowForward size={12} /></div>
        },
        {
            icon: AI2Icon,
            title: "Route via Solana",
            content: "Save 85% on gas fees",
            rate: <div className="border-green-600 border-[1px] px-3 py-0 text-[8px] md:text-xs bg-[#00C95133] text-green-600">85% savings</div>,
            rateDescription: "   ",
            description: <div className="flex gap-1 py-2.5 items-center"><div className="text-xs text-muted-foreground">Take Action</div><IoArrowForward size={12} /></div>
        },
        // Dynamic trending token #1 (using index 3)
        ...(trendingTokens[3] ? [{
            icon: trendingTokens[3].logoURI ? trendingTokens[3].logoURI : AI3Icon,
            title: `${trendingTokens[3].symbol} Trending`,
            content: `${trendingTokens[3].name} up ${birdeyeService.formatPercentage(trendingTokens[3].priceChange24h)}, high momentum`,
            rate: <div className={`border-green-600 border-[1px] px-3 py-0 text-[8px] md:text-xs bg-[#00C95133] text-green-600`}>
                {birdeyeService.formatPercentage(trendingTokens[3].priceChange24h)}
            </div>,
            rateDescription: "   ",
            description: <div 
                className="flex gap-1 py-2.5 items-center cursor-pointer hover:text-primary transition-colors" 
                onClick={() => handleTakeAction(trendingTokens[3])}
            >
                <div className="text-xs text-muted-foreground">Take Action</div>
                <IoArrowForward size={12} />
            </div>
        }] : [{
            icon: AI3Icon,
            title: "Diversify into DePIN tokens",
            content: "AI models suggest 10% allocation to RNDR, FIL for optimal returns.",
            rate: <div className="border-green-600 border-[1px] px-3 py-0 text-[8px] md:text-xs bg-[#00C95133] text-green-600">+24% potential</div>,
            rateDescription: "   ",
            description: <div className="flex gap-1 py-2.5 items-center"><div className="text-xs text-muted-foreground">Take Action</div><IoArrowForward size={12} /></div>
        }]),
        // Dynamic trending token #2 (using index 4)
        ...(trendingTokens[4] ? [{
            icon: trendingTokens[4].logoURI ? trendingTokens[4].logoURI : AI4Icon,
            title: `${trendingTokens[4].symbol} Rally`,
            content: `${trendingTokens[4].name} leads with ${birdeyeService.formatPercentage(trendingTokens[4].priceChange24h)} gains`,
            rate: <div className="border-green-600 border-[1px] px-3 py-0 text-[8px] md:text-xs bg-[#00C95133] text-green-600">
                {birdeyeService.formatPercentage(trendingTokens[4].priceChange24h)}
            </div>,
            rateDescription: "   ",
            description: <div 
                className="flex gap-1 py-2.5 items-center cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleTakeAction(trendingTokens[4])}
            >
                <div className="text-xs text-muted-foreground">Take Action</div>
                <IoArrowForward size={12} />
            </div>
        }] : [{
            icon: AI4Icon,
            title: "AI Token Rally",
            content: "RNDR leads with 12.4% gains, strong DePIN sector momentum",
            rate: <div className="border-green-600 border-[1px] px-3 py-0 text-[8px] md:text-xs bg-[#00C95133] text-green-600">+18.3%</div>,
            rateDescription: "   ",
            description: <div className="flex gap-1 py-2.5 items-center"><div className="text-xs text-muted-foreground">Take Action</div><IoArrowForward size={12} /></div>
        }]),
        {
            icon: AI5Icon,
            title: "Gas Optimization",
            content: "Ethereum fees down 10%, good time for large swaps",
            rate: <div className="border-red-600 text-center border-[1px] px-3 py-0 text-[8px] md:text-xs bg-[#E7000B33] text-red-600">-15%</div>,
            rateDescription: "   ",
        },
        // Dynamic trending token #3 (using index 5)
        ...(trendingTokens[5] ? [{
            icon: trendingTokens[5].logoURI ? trendingTokens[5].logoURI : AI6Icon,
            title: `${trendingTokens[5].symbol} Volume Surge`,
            content: `${trendingTokens[5].name} volume ${birdeyeService.formatNumber(trendingTokens[5].volume24h)}, optimal for swaps`,
            rate: <div className="border-green-600 border-[1px] px-3 py-0 text-[8px] md:text-xs bg-[#00C95133] text-green-600">
                {birdeyeService.formatNumber(trendingTokens[5].volume24h)}
            </div>,
            rateDescription: "   ",
            description: <div 
                className="flex gap-1 py-2.5 items-center cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleTakeAction(trendingTokens[5])}
            >
                <div className="text-xs text-muted-foreground">Take Action</div>
                <IoArrowForward size={12} />
            </div>
        }] : [{
            icon: AI6Icon,
            title: "Cross-Chain Volume",
            content: "Bridge activity up 24% this week, optimal for swaps",
            rate: <div className="border-green-600 border-[1px] px-3 py-0 text-[8px] md:text-xs bg-[#00C95133] text-green-600">$18.4M</div>,
            rateDescription: "   ",
            description: <div className="flex gap-1 py-2.5 items-center"><div className="text-xs text-muted-foreground">Take Action</div><IoArrowForward size={12} /></div>
        }]),
    ];
    return (
        <div className="p-6 border-input border-[1px] bg-card w-full max-w-250 xl:max-w-full ">
            <div className="flex items-center gap-1.5">
                <div className="">
                    <Image src={AIBrainIcon.src} alt="" height={15} width={15} />
                </div>
                <div className="font-geist-mono font-semibold text-base text-foreground">
                    AI intelligence and Market insights
                </div>
            </div>
            <div className="flex flex-col gap-5 w-full overflow-x-auto mt-[30px] pb-2">
                {AITradingData.map((item, idx) => (
                    <InfoCard isLoading={isLoading} key={idx} {...item} />
                ))}
            </div>
        </div>
    )
}

export default AIBrain;
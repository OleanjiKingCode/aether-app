import { useEffect, useState } from "react";
import Detail from "./detail";
import Swap from "./swap";
import HybridSwap from "./hybrid-swap";
import CustomSwapUI from "./custom-swap-ui";
import CustomSwapTest from "./custom-swap-test";
import AIRecommendationAlert from "../common/ai-recommendation-alert";
import UnifiedWallet from "../unified-wallet";
import { useWalletContext } from "@/context/WalletContext";

const MainPanel = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showTest, setShowTest] = useState(false);
    const [currentRoute, setCurrentRoute] = useState<any>(null);
    const [fromChain, setFromChain] = useState<any>(null);
    const [toChain, setToChain] = useState<any>(null);
    const [fromToken, setFromToken] = useState<any>(null);
    const [toToken, setToToken] = useState<any>(null);
    const [refreshKey, setRefreshKey] = useState(0); // To trigger detail refresh
    const { isConnected, activeWalletType } = useWalletContext();
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }, [])
    return (
        <div className="flex gap-6 flex-col xl:flex-row">
            <div className="flex flex-col gap-3.5 flex-2">
                <AIRecommendationAlert value="52s" isLoading={isLoading} description="Cross-Chain Bridge route - Execution time:"/>

                {showTest ? (
                    <CustomSwapTest />
                ) : (
                    <CustomSwapUI 
                        isLoading={isLoading}
                        onRouteUpdate={(route) => {
                            console.log('Route updated:', route);
                            setCurrentRoute(route);
                        }}
                        onChainUpdate={(fromChain, toChain) => {
                            setFromChain(fromChain);
                            setToChain(toChain);
                        }}
                        onTokenUpdate={(fromToken, toToken) => {
                            setFromToken(fromToken);
                            setToToken(toToken);
                        }}
                        onExecutionComplete={(result) => {
                            console.log('Swap completed:', result);
                            // Trigger detail panel refresh to show new swap in history
                            setRefreshKey(prev => prev + 1);
                        }}
                    />
                )}
            </div>
            <div className="w-full flex-1">
                <Detail 
                    key={refreshKey}
                    isLoading={isLoading} 
                    route={currentRoute}
                    fromChain={fromChain}
                    toChain={toChain}
                    fromToken={fromToken}
                    toToken={toToken}
                />
            </div>
        </div>
    )
}

export default MainPanel;
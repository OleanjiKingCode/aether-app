import React, { useEffect, useState } from "react";
import Card from "./card";
import PortfolioCardIcon from "public/icon/portfolio_wallet.svg"
import VolumneIcon from "public/icon/24hr_volume.svg"
import AssetIcon from "public/icon/asset.svg"
import StakingIcon from "public/icon/staking_img.svg"
import ArrowUpIcon from "public/icon/arrow-up.svg"
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletContext } from "@/context/WalletContext";
import { mobulaService } from "@/services/mobula.service";

const Cards = () => {
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const { publicKey, connected: solanaConnected } = useWallet();
  const { activeWalletType } = useWalletContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [portfolioChange, setPortfolioChange] = useState<string>('+0.0%');
  const [assetCount, setAssetCount] = useState<number>(0);
  const [chainsCount, setChainsCount] = useState<number>(0);

  useEffect(() => {
    const fetchPortfolioData = async () => {
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
          stale: 60, // Cache for 1 minute
        });

        console.log('Portfolio data received:', portfolio);
        console.log('Total wallet balance:', portfolio.total_wallet_balance);
        console.log('Assets:', portfolio.assets);

        // Set portfolio value - use correct field name
        const totalBalance = portfolio.total_wallet_balance || 0;
        console.log('Setting portfolio value to:', totalBalance);
        setPortfolioValue(totalBalance);

        // Count unique assets and chains
        if (portfolio.assets && Array.isArray(portfolio.assets)) {
          // Filter out assets with 0 balance
          const validAssets = portfolio.assets.filter(asset => asset.estimated_balance > 0);
          console.log('Valid assets count:', validAssets.length);
          setAssetCount(validAssets.length);
          
          // Count unique chains from cross_chain_balances
          const uniqueChains = new Set<string>();
          validAssets.forEach(asset => {
            if (asset.cross_chain_balances) {
              Object.keys(asset.cross_chain_balances).forEach(chain => {
                uniqueChains.add(chain);
              });
            }
          });
          console.log('Unique chains:', uniqueChains.size);
          setChainsCount(uniqueChains.size);
        }

        // Calculate 24h change (would need historical data, using mock for now)
        setPortfolioChange('+8.2%');

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, [evmAddress, publicKey, activeWalletType, evmConnected, solanaConnected]);

  return (
    <div className="flex justify-between w-full gap-3 xl:gap-0 flex-col xl:flex-row  max-w-250 xl:max-w-full">
      <Card 
        isLoading={isLoading} 
        title="Portfolio Value" 
        content={`$${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
        description={portfolioChange} 
        icon={PortfolioCardIcon.src} 
        descriptionIcon={ArrowUpIcon.src} 
      />
      <Card 
        isLoading={isLoading} 
        title="24h Volume" 
        content="$24.45M" 
        description="+8.2%" 
        icon={VolumneIcon.src} 
        descriptionIcon={ArrowUpIcon.src} 
        additionalDescription="Last 24hrs" 
      />
      <Card 
        isLoading={isLoading} 
        title="Assets" 
        content={assetCount.toString()} 
        description={`${chainsCount} chain${chainsCount !== 1 ? 's' : ''}`} 
        icon={AssetIcon.src} 
      />
      <Card 
        isLoading={isLoading} 
        title="Staking APY" 
        content="10.2%" 
        description="Current rate" 
        icon={StakingIcon.src} 
      />
    </div>
  );
};

export default Cards;

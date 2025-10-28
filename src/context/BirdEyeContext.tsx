import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { birdeyeService, TrendingToken } from '@/services/birdeye.service';

interface BirdEyeContextType {
  trendingTokens: TrendingToken[];
  topGainers: TrendingToken[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const BirdEyeContext = createContext<BirdEyeContextType | undefined>(undefined);

export const useBirdEyeData = () => {
  const context = useContext(BirdEyeContext);
  if (!context) {
    throw new Error('useBirdEyeData must be used within a BirdEyeProvider');
  }
  return context;
};

interface BirdEyeProviderProps {
  children: ReactNode;
}

export const BirdEyeProvider: React.FC<BirdEyeProviderProps> = ({ children }) => {
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const [topGainers, setTopGainers] = useState<TrendingToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch top gainers (more than needed to filter)
      const gainers = await birdeyeService.getTopGainers(10);
      console.log('BirdEye Context: Fetched top gainers:', gainers);
      
      // Filter tokens by minimum liquidity ($40k) and market cap ($100k)
      const filteredGainers = gainers.filter(token => 
        token.liquidity && token.liquidity >= 40000 && 
        token.marketCap && token.marketCap >= 100000
      );
      
      console.log(`BirdEye Context: Filtered ${filteredGainers.length} tokens with sufficient liquidity and market cap`);
      
      // Fetch high liquidity tokens for opportunities
      const opportunities = await birdeyeService.getHighOpportunityTokens(10);
      console.log('BirdEye Context: Fetched high opportunity tokens:', opportunities);
      
      setTopGainers(filteredGainers);
      setTrendingTokens([...filteredGainers, ...opportunities].slice(0, 10)); // Combine and limit
      setIsLoading(false);
    } catch (error) {
      console.error('BirdEye Context: Failed to fetch data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchData, 120000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <BirdEyeContext.Provider value={{ trendingTokens, topGainers, isLoading, refetch: fetchData }}>
      {children}
    </BirdEyeContext.Provider>
  );
};


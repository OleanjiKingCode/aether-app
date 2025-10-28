import AIBrain from "@/components/dashboard/ai-brain";
import Cards from "@/components/dashboard/cards";
import Chart from "@/components/dashboard/chart";
import PortfolioAllocation from "@/components/dashboard/portfolio-allocation";
import Quick from "@/components/dashboard/quick";
import RecentActivity from "@/components/dashboard/recent-activity";
import TopYield from "@/components/dashboard/top-yield";
import { useBirdEyeData } from "@/context/BirdEyeContext";

const Dashboard = () => {
  // Use shared BirdEye data from context
  const { topGainers: trendingTokens, isLoading: isLoadingTrending } = useBirdEyeData();

  return (
    <div className="ml-0 sm:ml-50">
      <div className="h-[106px] flex items-center px-[32px] border-y-[1px] border-input">
        <div className="flex flex-col gap-[6px]">
          <b className="text-foreground">Dashboard</b>
          <p className="text-muted-foreground text-xs md:text-sm">
            Welcome to AetherDEX! Your decentralized trading dashboard for AI
            and DePIN tokens.
          </p>
        </div>
      </div>
      <div className="md:p-[32px] p-5 flex flex-col md:gap-[24px] gap-[16px]">
        <Cards />
        <Quick />
        <div className="flex max-w-250 xl:max-w-full w-full gap-6 flex-col xl:flex-row ">
          <Chart />
          <PortfolioAllocation />
        </div>
        <div className="flex w-full gap-6 flex-col xl:flex-row ">
          <TopYield trendingTokens={trendingTokens} isLoading={isLoadingTrending} />
          <AIBrain trendingTokens={trendingTokens} isLoading={isLoadingTrending} />
        </div>
        <div className="flex w-full gap-6">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

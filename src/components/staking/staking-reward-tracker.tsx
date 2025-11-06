import Image from "next/image";
import BaseCard from "../common/base-card";
import RewardTrackerIcon from "public/icon/stake/staking-reward-tracker-icon.svg";
import GiftIcon from "public/icon/stake/staking-gift-icon.svg";
import Bar from "../common/skeleton/bar";
import Divider from "../common/divider";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StakingRewardTrackerProps {
  isLoading?: boolean;
}

const StakingRewardTracker = ({ isLoading }: StakingRewardTrackerProps) => {
  const mockData = [
    { time: "2hrs", price: 1, label: "1k" },
    { time: "4hrs", price: 5000, label: "5k" },
    { time: "6hrs", price: 2000, label: "2k" },
    { time: "8hrs", price: 3000, label: "3k" },
    { time: "10hrs", price: 7000, label: "7k" },
  ];
  return (
    <BaseCard className="flex gap-5 p-6 w-full xl:w-[450px] flex-col h-fit">
      <div className="flex gap-1.5 items-center">
        <Image src={RewardTrackerIcon.src} width={20} height={20} alt="" />
        <div className="text-base text-foreground font-semibold">
          Reward tracker
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full items-center justify-center">
        <Image src={GiftIcon.src} width={32} height={32} alt="" />
        <div className="text-xs text-muted-foreground font-medium">
          Claimable Rewards
        </div>
        <div className="text-2xl text-green-600 font-medium">25.8 AETH</div>
        <div className="text-sm text-muted-foreground font-medium">$77.66</div>
        <button className="w-full h-10 gradient-bg text-xs text-foreground cursor-pointer">
          {isLoading && <Bar barClassName="w-8 h-3 mx-auto" />}
          {!isLoading && "Claim Rewards"}
        </button>
      </div>
      <Divider />
      <div className="flex justify-between w-full">
        <div className="w-full text-muted-foreground text-xs font-medium">
          Est. Monthly
        </div>
        <div className="w-full text-muted-foreground text-xs font-medium  text-end">
          ~42.5 AETH
        </div>
      </div>
      <div className="flex justify-between w-full">
        <div className="w-full text-muted-foreground text-xs font-medium">
          Next Reward
        </div>
        <div className="w-full text-muted-foreground text-xs font-medium  text-end">
          ~2 days
        </div>
      </div>
      <Divider />
      <div className="h-[230px] border border-input">
        <div className="p-4 text-muted-foreground text-sm font-semibold">
          Reward Growth
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart
            width={200}
            height={60}
            data={mockData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <Area
              type="monotone"
              dataKey="price"
              stroke="#00A63E"
              fill="#052E16"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </BaseCard>
  );
};

export default StakingRewardTracker;

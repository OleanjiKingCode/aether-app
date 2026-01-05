import Image from "next/image";
import BaseCard from "../common/base-card";
import PerformanceMetricIcon from "public/icon/stake/staking-performance-metrics-icon.svg";
import StakingTierIcon from "public/icon/stake/staking-tier-icon.svg";
import { Progressbar } from "../common/progresbar";

const StakingMetrics = () => {
  const metricsData = {
    total: "0.00 $AETH",
    average: "0.00 $AETH",
    day: "0 days",
    compound: "Auto (Daily)",
    share: "0.00%",
  };

  return (
    <div className="flex gap-3 w-full xl:w-[450px] flex-col h-fit ">
      <BaseCard className="p-6">
        <div className="flex gap-2">
          <div>
            <Image src={PerformanceMetricIcon} width={20} height={20} alt="" />
          </div>
          <div className="text-base text-foreground font-semibold">
            Perfomance Metrics
          </div>
        </div>
        <div className="flex flex-col gap-5 mt-2.5">
          <div className="flex justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              Total Rewards Earned
            </div>
            <div className="text-xs text-foreground font-semibold">
              {metricsData.total}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              Average Daily Rewards
            </div>
            <div className="text-xs text-foreground font-semibold">
              {metricsData.average}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              Days Staked
            </div>
            <div className="text-xs text-foreground font-semibold">
              {metricsData.day}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              Compound Rate
            </div>
            <div className="text-xs text-foreground font-semibold">
              {metricsData.compound}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              Your Share
            </div>
            <div className="text-xs text-foreground font-semibold">
              {metricsData.share}
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard className="p-6">
        <div className="flex gap-2">
          <div>
            <Image src={StakingTierIcon} width={20} height={20} alt="" />
          </div>
          <div className="text-base text-foreground font-semibold">
            Staking Tier
          </div>
        </div>
        <div className="flex flex-col gap-5 mt-2.5">
          <div className="flex justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              1.0x Multiplier
            </div>
            <div className="text-xs text-secondary bg-[#FB9B0033] border border-border font-medium px-3 py-[1px]">
              Bronze Tier
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <div className="text-xs text-foreground">Progress to Silver</div>
              <div className="text-xs text-foreground">0%</div>
            </div>
            <Progressbar
              now={0}
              min={0}
              max={100}
              color="bg-primary rounded-full"
              containerClass="bg-[#bb3eff26] !h-2 !border-none"
            />
            <div className="text-[10px] text-muted-foreground xl:w-[357px]">
              Stake more $AETH to reach Silver tier
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  );
};

export default StakingMetrics;

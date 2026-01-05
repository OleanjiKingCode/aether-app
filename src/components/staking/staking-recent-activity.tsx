import Image from "next/image";
import BaseCard from "../common/base-card";
import RecentActivityIcon from "public/icon/stake/staking-graph-icon.svg";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";

interface StakingRecentActivityProps {
  isLoading?: boolean;
}

const StakingRecentActivity = ({ isLoading }: StakingRecentActivityProps) => {
  const recentData: any[] = [];

  const colors = {
    bg: ["#00C95133", "#EFB10033", "#FB2C3633"],
    text: ["green", "yellow", "red"],
  };
  return (
    <BaseCard className="p-8 flex flex-col gap-4 w-full mt-6">
      <div className="flex gap-1.5 items-center">
        <div>
          <Image src={RecentActivityIcon} width={20} height={20} alt="" />
        </div>
        <div className="text-base text-foreground font-semibold">
          Recent Activity
        </div>
      </div>
      {recentData.length > 0 ? (
        recentData.map((activity, index) => {
          return (
            <BaseCard className="p-5 flex justify-between" key={index}>
              <div className="flex gap-2">
                <div
                  className={`flex items-center justify-center rounded-full w-8 h-8 bg-[${
                    colors.bg[index % 3]
                  }]`}
                >
                  {activity.status === "Pending" ? (
                    <AiOutlineMinus size={12} />
                  ) : (
                    <AiOutlinePlus size={12} />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-foreground font-semibold">
                    {activity.type} {activity.token}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.transaction}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-foreground font-semibold">
                    {activity.amount} {activity.token}
                  </div>
                  <div className="flex gap-1 items-center">
                    <div
                      className={`${
                        activity.status === "Pending"
                          ? "text-secondary"
                          : "text-green-500"
                      } text-xs font-normal`}
                    >
                      {activity.status}
                    </div>
                    <div className="w-0.5 h-0.5 bg-white rounded-full" />
                    <div className="text-xs text-muted-foreground">
                      {activity.date}
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>
          );
        })
      ) : (
        <div className="w-full py-8 text-center text-muted-foreground text-sm">
          No recent activity found
        </div>
      )}
    </BaseCard>
  );
};

export default StakingRecentActivity;

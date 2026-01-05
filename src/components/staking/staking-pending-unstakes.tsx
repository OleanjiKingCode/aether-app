import BaseCard from "../common/base-card";
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import Bar from "../common/skeleton/bar";

interface StakingPendingUnstakesProps {
  isLoading?: boolean;
}

const StakingPendingUnstakes = ({ isLoading }: StakingPendingUnstakesProps) => {
  const unstakes: any[] = [];
  return (
    <div className="flex flex-col gap-2.5">
      {isLoading && <Bar barClassName="w-8 h-3 mx-auto" />}
      <div className="text-sm text-foreground font-semibold">
        Pending Unstakes
      </div>
      <div className="flex flex-col gap-3">
        {unstakes.length > 0 ? (
          unstakes.map((stake, index) => {
            return (
              <BaseCard key={index} className="px-4 py-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-foreground font-semibold">
                      {stake.amout}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {stake.period}
                    </div>
                  </div>
                  <div className="flex gap-1 border border-secondary px-3 bg-[#FB9B0033] text-secondary h-fit items-center">
                    <PiClockCounterClockwiseBold size={10} />
                    <div className="text-xs font-medium">Pending</div>
                  </div>
                </div>
              </BaseCard>
            );
          })
        ) : (
          <div className="text-xs text-muted-foreground text-center py-4">
            No pending unstakes found
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingPendingUnstakes;

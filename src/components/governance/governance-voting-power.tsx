import BaseCard from "../common/base-card"
import { FiCheckCircle } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";

import Bar from "../common/skeleton/bar";
import Divider from "../common/divider";

interface GovernanceVotingPowerProps {
    isLoading?: boolean,
    stakedAETH: number,
    votingPower: number,
    participationRate: string,
    reward: number
}

const GovernanceVotingPower = ({ stakedAETH, votingPower, participationRate, reward, isLoading }: GovernanceVotingPowerProps) => {
    return (
        <BaseCard className="flex flex-col gap-2.5">
            <div className="flex gap-1.5 items-center">
                <div className="">
                    {isLoading && <Bar barClassName="w-3 h-3" />}
                    {!isLoading && <FiCheckCircle className="text-secondary" size={20} />}
                </div>
                <div className="text-base text-foreground">
                    {isLoading && <Bar barClassName="w-20 h-4" />}
                    {!isLoading && "Your Voting Power"}
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">Staked AETH</div>}
                </div>
                <div className={`text-sm`}>
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && <div className="text-xs text-secondary">{stakedAETH.toLocaleString('en-US')}</div>}
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">Voting Power</div>}
                </div>
                <div className={`text-sm`}>
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && <div className="text-xs text-secondary">{votingPower.toLocaleString('en-US')}</div>}
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">Participation Rate</div>}
                </div>
                <div className={`text-sm`}>
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && <div className="text-xs text-green-500">{participationRate}</div>}
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">Voting Rewards</div>}
                </div>
                <div className={`text-sm`}>
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && <div className="text-xs text-green-500">{'+' + reward.toLocaleString('en-US') + ' AETH'}</div>}
                </div>
            </div>
            <Divider />
            <div className="w-full flex justify-center gap-2.5 items-center">
                <div className="text-muted-foreground text-xs font-medium">
                    Increase power.
                </div>
                <div className="text-secondary text-xs font-medium">
                    Stake AETH
                </div>
                <FaArrowRightLong className="text-secondary" size={20} />
            </div>
        </BaseCard>
    )
}

export default GovernanceVotingPower
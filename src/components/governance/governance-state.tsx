import BaseCard from "../common/base-card"
import { FaBuildingColumns } from "react-icons/fa6";

import { FaArrowRightLong } from "react-icons/fa6";

import Bar from "../common/skeleton/bar";
import Divider from "../common/divider";

interface GovernanceStateProps {
    isLoading?: boolean,
    activeProposals: number,
    totalVoters: number,
    totalVotingPower: string,
    averageParticipation: string
}

const GovernanceState = ({ activeProposals, totalVoters, totalVotingPower, averageParticipation, isLoading }: GovernanceStateProps) => {
    return (
        <BaseCard className="flex flex-col gap-2.5">
            <div className="flex gap-1.5 items-center">
                <div className="">
                    {isLoading && <Bar barClassName="w-3 h-3" />}
                    {!isLoading && <FaBuildingColumns className="text-secondary" size={20} />}
                </div>
                <div className="text-base text-foreground">
                    {isLoading && <Bar barClassName="w-20 h-4" />}
                    {!isLoading && "Governance Stats"}
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">Active Proposals</div>}
                </div>
                <div className={`text-sm`}>
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">{activeProposals.toLocaleString('en-US')}</div>}
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">Total Voters</div>}
                </div>
                <div className={`text-sm`}>
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && <div className="text-xs text-text-muted-foreground">{totalVoters.toLocaleString('en-US')}</div>}
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">Total Voting Power</div>}
                </div>
                <div className={`text-sm`}>
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">{totalVotingPower}</div>}
                </div>
            </div>
            <div className="flex justify-between w-full">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">Average Participation</div>}
                </div>
                <div className={`text-sm`}>
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && <div className="text-xs text-secondary">{averageParticipation}</div>}
                </div>
            </div>
        </BaseCard>
    )
}

export default GovernanceState
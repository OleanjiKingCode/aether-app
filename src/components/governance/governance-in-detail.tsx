import { useEffect, useState } from "react";
import GovernanceAccordion from "./governance-accordion"
import GovernanceState from "./governance-state"
import GovernanceVotingPower from "./governance-voting-power"

const GovernanceInDetail = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])
    return (
        <div className="flex flex-col gap-6">
            <GovernanceVotingPower isLoading={isLoading} stakedAETH={5000} votingPower={5000} participationRate={`87.5%`} reward={12.5} />
            <GovernanceState isLoading={isLoading} activeProposals={2} totalVoters={3247} totalVotingPower="2.4M AETH" averageParticipation="73.2%" />
            <GovernanceAccordion isLoading={isLoading} />
        </div>
    )
}

export default GovernanceInDetail
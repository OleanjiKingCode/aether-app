import { useEffect, useState } from "react";
import AIRecommendationAlert from "../common/ai-recommendation-alert";
import { FiCheckCircle } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import SwitchButton from "../common/switch-button";
import GovernanceActiveProposals from "./governance-active-proposals";
import GovernanceVotingHistory from "./governance-voting-history";
import GovernanceInDetail from "./governance-in-detail";

const GovernanceMainSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState(1) // 1 : Active Proposals. 2 : Voting History

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [])

    const switchButtonData = [
        {
            icon: <FiCheckCircle size={16} />
        },
        {
            icon: <FiClock size={16} />
        }
    ]
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])
    return (
        <div className="flex gap-6 flex-col xl:flex-row">
            <div className="flex flex-col gap-3.5 w-full xl:w-3/5">
                <AIRecommendationAlert value="45s" isLoading={isLoading} description="Cross-Chain Bridge route - Execution time:" />
                <SwitchButton containerClass="!w-full switch-gradient-border" isLoading={isLoading} value={mode} setValue={setMode} firstOptionName="Active Proposals" firstOptionIcon={switchButtonData[0].icon} secondOptionName="Voting History" secondOptionIcon={switchButtonData[1].icon} />
                {mode === 1 && (
                    <GovernanceActiveProposals />
                )}
                {mode === 2 && (
                    <GovernanceVotingHistory />
                )}
            </div>
            <div className="w-full xl:w-2/5">
                <GovernanceInDetail />
            </div>
        </div>
    )
}

export default GovernanceMainSection
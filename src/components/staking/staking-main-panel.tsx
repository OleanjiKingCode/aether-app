import { useEffect, useState } from "react";
import SwitchButton from "../common/switch-button"
import StakingSwitchIcon from "public/icon/stake/staking-switch-icon.svg"
import Image from "next/image";
import { FaChartLine } from "react-icons/fa6";
import { MdOutlineFiberSmartRecord } from "react-icons/md";
import StakingStakePanel from "./staking-stake-panel";
import StakingRewardTracker from "./staking-reward-tracker";
import StakingPerformance from "./staking-performance";
import StakingMetrics from "./staking-metrics";
import StakingRecentActivity from "./staking-recent-activity";


const StakingMainPanel = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState(1) // 1 : Staking. 2 : Activity

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [])

    const switchButtonData = [
        {
            icon: <MdOutlineFiberSmartRecord size={16} className="rotate-135" />
        },
        {
            icon: <FaChartLine size={16} />
        }
    ]

    return (
        <div className="flex flex-col gap-6">
            <SwitchButton isLoading={isLoading} value={mode} setValue={setMode} firstOptionName="Staking" firstOptionIcon={switchButtonData[0].icon} secondOptionName="Activity" secondOptionIcon={switchButtonData[1].icon} />
            {mode === 1 && (
                <div className="flex flex-col xl:flex-row gap-6">
                    <StakingStakePanel />
                    <StakingRewardTracker />
                </div>
            )}
            {mode === 2 && (
                <div>
                    <div className="flex flex-col xl:flex-row gap-6">
                        <StakingPerformance />
                        <StakingMetrics />
                    </div>
                    <StakingRecentActivity />
                </div>
            )}
        </div>
    )
}

export default StakingMainPanel
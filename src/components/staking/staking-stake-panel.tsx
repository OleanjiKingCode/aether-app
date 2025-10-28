import { useEffect, useState } from "react"
import BaseCard from "../common/base-card"
import StakeUnstakeSwitch from "./stake-unstake-switch"
import StakeTokenPanel from "./staking-stake-token-panel"
import StakingLockPeriod from "./staking-lock-period"
import StakingValidatorAutoCompound from "./staking-validator-autocompound"
import StakingTransactionSummary from "./staking-transaction-summary"
import Bar from "../common/skeleton/bar"
import { IoInformationCircleOutline } from "react-icons/io5";
import StakingPendingUnstakes from "./staking-pending-unstakes"

const StakingStakePanel = () => {
    const [mode, setMode] = useState(1) // 1 : stake. 2 : unstake
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [])
    return (
        <BaseCard className="flex flex-col gap-5 p-6 w-full">
            <StakeUnstakeSwitch isLoading={isLoading} value={mode} setValue={setMode} />
            {mode === 1 && (
                <>
                    <StakeTokenPanel isLoading={isLoading} title="Amount to Stake" />
                    <StakingLockPeriod />
                    <StakingValidatorAutoCompound />
                    <StakingTransactionSummary />
                    <button className="w-full h-10 gradient-bg text-xs text-foreground cursor-pointer">
                        {isLoading && (<Bar barClassName="w-8 h-3 mx-auto" />)}
                        {!isLoading && ("Stake")}
                    </button>
                </>
            )}
            {mode === 2 && (
                <>
                    <div className="border border-secondary px-4 py-3 flex gap-1 bg-[#FB9B000D] items-center">
                        <div className="text-secondary">
                            <IoInformationCircleOutline size={16} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-sm text-muted-foreground font-medium">
                                Unbonding Period
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Unstaked tokens will be available after 7days
                            </div>
                        </div>
                    </div>
                    <StakeTokenPanel isLoading={isLoading} title="Amount to Unstake" />
                    <StakingPendingUnstakes />
                    <button className="w-full h-10 gradient-bg text-xs text-foreground cursor-pointer">
                        {isLoading && (<Bar barClassName="w-8 h-3 mx-auto" />)}
                        {!isLoading && ("Unstake")}
                    </button>
                </>
            )}
        </BaseCard>
    )
}

export default StakingStakePanel
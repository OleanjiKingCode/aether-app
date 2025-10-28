import ReadyToStart from "@/components/staking/ready-to-start"
import StakingMain from "@/components/staking/staking-main"
import { useWalletContext } from "@/context/WalletContext"

const Stake = () => {
    const { isConnected } = useWalletContext()
    return (
        <div className="ml-0 sm:ml-50">
            <div className="flex items-center px-6 md:px-8 py-4.5 border-y-[1px] border-input">
                <div className="flex flex-col gap-y-1.5">
                    <b className="text-foreground">Staking</b>
                    <p className="text-muted-foreground text-xs h-11 md:h-10 md:text-sm">
                        Stake AETH tokens to earn rewards and participate in governance.
                    </p>
                </div>
            </div>
            <div className="md:p-[32px] p-5 flex flex-col md:gap-[24px] gap-[16px]">
                {!isConnected && (
                    <ReadyToStart />
                )}
                {isConnected && (
                    <StakingMain />
                )}
            </div>
        </div>
    )
}

export default Stake
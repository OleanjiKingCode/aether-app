import Divider from "../common/divider"

const StakingTransactionSummary = () => {
    return (
        <div className="border border-input bg-background p-6 flex flex-col gap-6">
            <div className="flex justify-between">
                <div className="text-base text-foreground font-semibold">Transaction Summary</div>
                <div className="border border-secondary px-3 bg-[#FB9B0033] text-secondary text-xs h-fit">
                    90 Days Pool
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <div className="text-muted-foreground text-sm">
                        You will stake:
                    </div>
                    <div className="text-secondary text-sm font-semibold">
                        500 AETH
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="text-muted-foreground text-sm">
                        You will receive:
                    </div>
                    <div className="text-muted-foreground text-sm font-semibold">
                        490.00 stAETH
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="text-muted-foreground text-sm">
                        APY for this duration:
                    </div>
                    <div className="text-muted-foreground text-sm font-semibold">
                        12.8%
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="text-muted-foreground text-sm">
                        Est. monthly rewards:
                    </div>
                    <div className="text-green-600 text-sm font-semibold">
                        5.33 AETH
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="text-muted-foreground text-sm">
                        Est. annual rewards:
                    </div>
                    <div className="text-green-600 text-sm font-semibold">
                        64.00 AETH
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="text-muted-foreground text-sm">
                        Withdraw time:
                    </div>
                    <div className="text-secondary text-sm font-semibold">
                        3 days
                    </div>
                </div>

            </div>
            <Divider />
             <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <div className="text-muted-foreground text-sm">
                        Network fee:
                    </div>
                    <div className="text-secondary text-sm font-semibold">
                        ~$2.40
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StakingTransactionSummary
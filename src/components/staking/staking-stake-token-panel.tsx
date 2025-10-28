import { useState } from "react"
import Bar from "../common/skeleton/bar"

interface StakeTokenPanelProps {
    isLoading?: boolean,
    title: string,
    tokenData?: any
}

const StakeTokenPanel = ({ isLoading,title, tokenData }: StakeTokenPanelProps) => {
    const [amount, setAmount] = useState(0.0)

    const stakeTokenData = {
        symbol: 'AETH',
        availableBalance: 1250,
        name: 'Aether Token'

    }
    return (
        <div className="border border-input bg-background py-6 px-3 flex flex-col gap-2.5">
            <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">{title}</div>
                <div className="text-sm text-muted-foreground">Available: {stakeTokenData.availableBalance.toLocaleString('en-US')} {stakeTokenData.symbol}</div>
            </div>
            <div className="border border-input px-3 py-1 flex gap-2 items-center">
                <div className="w-5 h-5 rounded-full bg-primary flex justify-center items-center">
                    {stakeTokenData.symbol.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <div className="text-xs text-foreground">{stakeTokenData.symbol}</div>
                    <div className="text-[10px] text-muted-foreground">{stakeTokenData.name}</div>
                </div>
            </div>
            <div className="text-foreground text-xl w-full">
                {isLoading && <Bar barClassName="w-full h-3" />}

                {!isLoading && (<input className="w-full outline-0" placeholder="Input amount" value={amount} onChange={(e: any) => setAmount(e.target.value)} />)}
            </div>
            <div className="flex justify-between">
                {isLoading && <Bar barClassName="md:w-25 h-3" />}
                {!isLoading && (<div className="text-muted-foreground text-sm">≈ $0.00</div>)}

                {isLoading && <Bar barClassName="md:w-25 h-3" />}
                {!isLoading && (<div className="text-lg text-primary ">Max</div>)}
            </div>
        </div>
    )
}

export default StakeTokenPanel
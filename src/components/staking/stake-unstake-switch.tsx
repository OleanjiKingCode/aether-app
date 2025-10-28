import { MdSouthWest } from "react-icons/md";
import Bar from "../common/skeleton/bar";

interface SwitchButtonProps {
    value: number,
    setValue: (val: number) => void,
    isLoading?: boolean,
}

const StakeUnstakeSwitch = ({ value, setValue, isLoading }: SwitchButtonProps) => {

    const handleSwitch = (val: number) => {
        if (!isLoading) {
            setValue(val)
        }
    }

    return (
        <div className="border border-input p-1 gap-2 flex w-full">
            <div className={`flex-1 py-1.5 px-3 cursor-pointer ${value === 1 ? 'bg-primary text-background' : 'text-muted-foreground'}`} onClick={() => handleSwitch(1)}>
                {isLoading && (<Bar barClassName="w-8 h-3" />)}
                {!isLoading && (
                    <div className="flex gap-2 items-center justify-center">
                        <MdSouthWest size={16} className="rotate-180" />
                        <div>Stake</div>
                    </div>
                )}
            </div>
            <div className={`flex-1 py-1.5 px-3 cursor-pointer ${value === 2 ? 'bg-primary text-background' : 'text-muted-foreground'}`} onClick={() => handleSwitch(2)}>
                {isLoading && (<Bar barClassName="w-8 h-3" />)}
                {!isLoading && (
                    <div className="flex gap-2 items-center justify-center">
                        <MdSouthWest size={16} />
                        <div>Unstake</div>
                    </div>)}
            </div>
        </div>
    )
}

export default StakeUnstakeSwitch;
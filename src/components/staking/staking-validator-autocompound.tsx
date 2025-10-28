import { useId, useState } from "react";
import { MdInfoOutline } from "react-icons/md"

const StakingValidatorAutoCompound = () => {
    const [checked, setChecked] = useState(false);
    const checkBoxId = useId()
    return (
        <div className="flex gap-5 flex-col md:flex-row">
            <div className="flex gap-3 flex-col w-full">
                <div className="flex gap-1.5 items-center">
                    <div className="text-sm text-foreground font-semibold">Validator</div>
                    <MdInfoOutline size={10} className="text-secondary" />
                </div>
                <div className="border border-input bg-background px-5 py-3 flex gap-1">
                    <div className="w-5 h-5 rounded-full bg-primary flex justify-center items-center text-[10px]">
                        AH
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-muted-foreground text-sm font-medium">
                            AetherNode
                        </div>
                        <div className="text-muted-foreground text-xs">229,201 AETH staked</div>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 flex-col w-full">
                <div className="flex gap-1.5 items-center">
                    <div className="text-sm text-foreground font-semibold">Auto-Compound</div>
                    <MdInfoOutline size={10} className="text-secondary" />
                </div>
                <div className="border border-input bg-background px-5 py-3 flex gap-1 justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <div className="text-muted-foreground text-sm font-medium">
                            Enable
                        </div>
                        <div className="text-muted-foreground text-xs">Compound rewards automatically</div>
                    </div>
                    <div>
                        <div className="relative inline-block h-5 w-11">
                            <input
                                checked={checked}
                                className="peer h-4 w-9 cursor-pointer appearance-none bg-border transition-colors duration-300 checked:bg-secondary rounded-full"
                                id={checkBoxId}
                                onChange={() => {
                                    setChecked(!checked);
                                }}
                                type="checkbox"
                            />
                            <label
                                aria-labelledby="A label"
                                className="absolute top-[1px] left-[2px] h-4 w-4 cursor-pointer border bg-background rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-4.5 peer-checked:border-primary peer-checked:bg-white"
                                htmlFor={checkBoxId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default StakingValidatorAutoCompound
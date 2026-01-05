import Image from "next/image";
import PrivacyModeIcon from "public/icon/swap/Privacy-Mode-Icon.svg"
import { useId } from "react";
import Bar from "../common/skeleton/bar";

interface PrivacyModeProps {
    isPrivacy: boolean,
    setIsPrivacy: (privacy: boolean) => void,
    isLoading?: boolean
}

const PrivacyMode = ({ isPrivacy, setIsPrivacy, isLoading }: PrivacyModeProps) => {
    const checkBoxId = useId()
    return (
        <div className="w-full px-4.5 py-3 flex justify-between bg-[#FB9B000D] border-border border-[1px]">
            <div className="flex gap-1">
                <div>
                    {isLoading && <Bar barClassName="w-4 h-4" />}
                    {!isLoading && <Image src={PrivacyModeIcon} width={16} height={16} alt="" />}
                </div>
                <div className="flex flex-col gap-1">
                    {isLoading && <Bar barClassName="w-20 h-3" />}
                    {!isLoading && (<div className="text-foreground text-sm">Privacy Mode</div>)}

                    {isLoading && <Bar barClassName="w-50 h-3" />}
                    {!isLoading && (<div className="text-muted-foreground text-xs">Enable ZK-proofs for protection</div>)}
                </div>
            </div>
            <div className="relative inline-block h-5 w-11">
                <input
                    checked={isPrivacy}
                    className="peer h-4 w-9 cursor-pointer appearance-none bg-border transition-colors duration-300 checked:bg-secondary rounded-full"
                    id={checkBoxId}
                    disabled={isLoading}
                    onChange={() => {
                        setIsPrivacy(!isPrivacy);
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
    )
}

export default PrivacyMode; 
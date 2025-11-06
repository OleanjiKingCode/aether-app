import Image from "next/image"
import StarsIcon from "public/icon/stars-icon.svg"
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Bar from "./skeleton/bar";

interface TimeAlertProps {
    value?: string;
    description?: string;
    isLoading?: boolean;
}
const AIRecommendationAlert = ({ value, description, isLoading }: TimeAlertProps) => {
    const [close, setClose] = useState(false);
    const handleClose = () => {
        setClose(true)
    }
    return (
        <div className={`h-fit md:h-9.5 py-1 px-3.5 bg-card border-[1px] border-input flex w-full items-center relative ${close ? 'hidden' : 'block'}`}>
            <div className="absolute top-3 right-3.5" onClick={handleClose}><IoClose size={14} /></div>
            <div className="flex gap-2 items-center">
                <div className="rounded-full gradient-bg min-w-5 h-5 flex justify-center items-center">
                    {isLoading && (<Bar barClassName="w-3 h-3" />)}
                    {!isLoading && (<Image src={StarsIcon.src} width={9.3} height={9.3} alt="" />)}
                </div>
                <div className="flex gap-2">
                    {isLoading && (<Bar barClassName="!min-w-80 w-full h-[10.5px]" />)}
                    {!isLoading && (<div className="text-muted-foreground text-xs font-geist-mono">
                        <span className="text-secondary text-xs font-geist-mono mr-2">AI Recommendation:</span>
                        {description && <span>{description}</span>}
                        {value && (<span className="ml-2 text-muted-foreground text-xs font-geist-mono">{value}</span>)}
                    </div>)}
                </div>
            </div>
        </div>
    )
}

export default AIRecommendationAlert
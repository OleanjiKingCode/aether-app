import BaseCard from "../common/base-card"
import Image from "next/image";
import SwapDetailChainIcon from "public/icon/swap/swap-detail-chain-icon.svg"
import SwapDetailIcon from "public/icon/swap/swap-detail-icon.svg"
import { IoCheckmark } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import Bar from "../common/skeleton/bar";

interface SwapDetailProps {
    isProtection: boolean,
    isSmartRouting: boolean,
    network: string,
    isLoading?: boolean,
    hasRoute?: boolean  // Added to check if route is available
}

const SwapDetail = ({ isProtection, isSmartRouting, network, isLoading, hasRoute = false }: SwapDetailProps) => {
    // Don't show if no route is available
    if (!hasRoute && !isLoading) {
        return null;
    }
    return (
        <BaseCard className="flex flex-col gap-2.5">
            <div className="flex gap-1.5 items-center">
                <div className="">
                    {isLoading && <Bar barClassName="w-3 h-3" />}
                    {!isLoading && <Image src={SwapDetailIcon} width={15} height={15} alt="" />}
                </div>
                <div className="text-base text-foreground">
                    {isLoading && <Bar barClassName="w-20 h-4" />}
                    {!isLoading && "Swap Detail"}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-3 h-2.5" />}
                    {!isLoading && <IoCheckmark size={20} className="text-green-500" />}

                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">MEV Protection</div>}
                </div>
                <div className="text-sm text-green-500">
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && "Protected"}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-3 h-2.5" />}
                    {!isLoading && <IoCheckmark size={20} className="text-green-500" />}
                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && (<div className="text-sm text-foreground">Smart Routing</div>)}
                </div>
                <div className="text-sm text-green-500">
                    {isLoading && <Bar barClassName="w-16 h-2.5" />}
                    {!isLoading && "Activated"}
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex gap-3">
                    {isLoading && <Bar barClassName="w-3 h-2.5" />}
                    {!isLoading && <Image src={SwapDetailChainIcon} width={20} height={20} alt="" />}

                    {isLoading && <Bar barClassName="w-20 h-2.5" />}
                    {!isLoading && <div className="text-sm text-foreground">Chain</div>}
                </div>
                <div className={`text-sm text-foreground`}>
                    {isLoading && <Bar barClassName="w-40 h-2.5" />}
                    {!isLoading && network}
                </div>
            </div>
        </BaseCard>
    )
}

export default SwapDetail;
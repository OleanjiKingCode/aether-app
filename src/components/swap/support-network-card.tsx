import Image from "next/image";
import BaseCard from "../common/base-card";
import Bar from "../common/skeleton/bar";

interface SupportNetworkCardProps {
    icon: string;
    network: string;
    isActive: boolean;
    description: string;
    fee: string;
    iconClassName: string,
    isLoading?: boolean
}

const SupportNetworkCard = ({ icon, network, isActive, description, fee, iconClassName, isLoading }: SupportNetworkCardProps) => {
    return (
        <BaseCard className="py-2.5 px-3 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <div className={`${iconClassName} w-6 h-6 px-1 flex justify-center items-center rounded-full`}>
                        {isLoading && <Bar barClassName="w-3 h-3" />}
                        {!isLoading && (
                            <Image src={icon} width={20} height={20} alt="" />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        {isLoading && <Bar barClassName="w-20 h-3" />}
                        {!isLoading && <div className="text-sm text-foreground">{network}</div>}
                        {isLoading && <Bar barClassName="w-40 h-3" />}
                        {!isLoading && <div className="text-xs text-muted-foreground">{description}</div>}
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    {isLoading && <Bar barClassName="w-2 h-2 rounded-full" />}
                    {!isLoading && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                    {isLoading && <Bar barClassName="w-12 h-3" />}
                    {!isLoading && <div className="text-xs text-green-500">{isActive ? "Active" : "Inactive"}</div>}
                </div>
            </div>
            <div className="flex justify-between items-center">
                {isLoading && <Bar barClassName="w-20 h-3" />}
                {!isLoading && <div className="text-muted-foreground text-xs">
                    Transaction fee
                </div>}
                {isLoading && <Bar barClassName="w-16 h-3" />}
                {!isLoading && <div className="text-muted-foreground text-xs">
                    {fee}
                </div>}
            </div>
        </BaseCard>
    )

}

export default SupportNetworkCard;
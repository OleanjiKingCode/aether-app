import Image from "next/image";
import Bar from "../common/skeleton/bar";
import Divider from "../common/divider";

interface StakingCardProps {
    title: string,
    content: string,
    description: string,
    additionalDescription?: string,
    icon: any,
    isLoading?: boolean,
    descriptionClassName?: string
    additionalDescriptionClassName?: string
}

const StakingCard = ({ title, content, description, descriptionClassName, icon, additionalDescription, additionalDescriptionClassName, isLoading }: StakingCardProps) => {
    return (
        <div className="w-full max-w-250 xl:max-w-full xl:w-[294px] border-input bg-card border-[1px] h-[128px] px-6 py-2.5 flex flex-col items-start">
            <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-col gap-2">
                    {isLoading === true && (<Bar barClassName="w-28 h-3.5" />)}
                    {!isLoading && (<p className="text-muted-foreground text-xs">{title}</p>)}
                    {isLoading === true && (<Bar barClassName="w-21 h-5" />)}
                    {!isLoading && (<b className="text-[18px] text-foreground font-semibold">
                        {content}
                    </b>)}

                </div>
                <div className="flex justify-center items-center gradient-bg w-8 h-8">
                    {isLoading === true && (<Bar barClassName="w-8 h-8" />)}
                    {!isLoading && (<Image
                        width={12}
                        height={12}
                        src={icon}
                        alt="Card Icon"
                    />)}
                </div>
            </div>

            {isLoading === true && (<Bar barClassName="w-12 h-3" />)}
            {!isLoading && (
                <div className="flex flex-col items-start gap-1.5 w-full mt-2">

                    <p className={`text-xs text-muted-foreground ${descriptionClassName}`}>{description}</p>
                    <Divider />
                    <p className={`text-xs text-muted-foreground ${additionalDescriptionClassName}`}>{additionalDescription}</p>
                </div>
            )}

        </div>
    )

}

export default StakingCard;
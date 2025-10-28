import Image from "next/image";
import Bar from "../common/skeleton/bar";

interface CardProps {
    title: string,
    content: string,
    description: string,
    additionalDescription?: string,
    icon: any,
    descriptionIcon?: any,
    isLoading?: boolean
}

const Card = ({ title, content, description, icon, descriptionIcon, additionalDescription, isLoading }: CardProps) => {
    return (
        <div className="w-full max-w-250 xl:max-w-full xl:w-[294px] border-input bg-card border-[1px] h-[128px] px-[24px] py-5 flex flex-row items-center">
            <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-col gap-[8px]">
                    {isLoading === true && (<Bar barClassName="w-28 h-3.5" />)}
                    {!isLoading && (<p className="text-[#D2D2D2] text-[16px]">{title}</p>)}
                    {isLoading === true && (<Bar barClassName="w-21 h-5" />)}
                    {!isLoading && (<b className="md:text-[24px] text-foreground font-extrabold">
                        {content}
                    </b>)}
                    {isLoading === true && (<Bar barClassName="w-12 h-3" />)}

                    {!isLoading && (<div className="flex flex-row items-center gap-1">
                        {descriptionIcon && (<Image
                            width={20}
                            height={20}
                            src={descriptionIcon}
                            alt="arrow-icon"
                        />)}
                        <p className="text-[#00A63E]">{description}</p>
                        {additionalDescription && (<p className="text-[#D2D2D2]">{additionalDescription}</p>)}
                    </div>)}
                </div>
                <div className="rounded-full flex justify-center items-center bg-[#99774033] w-15 h-15">
                    {isLoading === true && (<Bar barClassName="w-8 h-8" />)}
                    {!isLoading && (<Image
                        width={60}
                        height={60}
                        src={icon}
                        alt="Card Icon"
                    />)}
                </div>

            </div>
        </div>
    )

}

export default Card;
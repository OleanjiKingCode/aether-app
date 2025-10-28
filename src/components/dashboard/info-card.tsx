import Image from "next/image"
import Bar from "../common/skeleton/bar"
import React from "react"

interface InfoCardProps {
    title: string | React.ReactNode,
    content: string | React.ReactNode,
    rate: any,
    rateDescription?: string,
    description?: any,
    icon?: any,
    isLoading?: boolean
}

const InfoCard = ({ title, content, rate, rateDescription, description, icon, isLoading }: InfoCardProps) => {
    // Check if icon is a URL string (from BirdEye) or a component (from imports)
    const isIconUrl = typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('https'));
    
    return (
        <div className="border border-input px-3 py-2.5 flex justify-between gap-3">
            {icon && (
                <div>
                    {isLoading === true && (<Bar barClassName="w-4 h-2" />)}
                    {!isLoading && (
                        isIconUrl ? (
                            <img 
                                src={icon} 
                                width={20} 
                                height={20} 
                                alt="" 
                                className="w-5 h-5 rounded-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <Image src={icon} width={20} height={20} alt="" />
                        )
                    )}
                </div>
            )}
            <div className={`flex flex-col gap-1 ${icon ? 'gap-2' : 'gap-1'} w-full`}>
                {isLoading === true && (<Bar barClassName="w-9.5 h-3" />)}
                {!isLoading && (<div className="font-normal text-xs sm:text-sm text-muted-foreground">{title}</div>)}
                {isLoading === true && (<Bar barClassName="w-20 h-3" />)}
                {!isLoading && (<div className="font-normal text-[8px] sm:text-xs text-muted-foreground">{content}</div>)}
                {isLoading === true && (<Bar barClassName="w-16 h-2.5" />)}
                {!isLoading && (<div className="">{description}</div>)}
            </div>
            <div className="flex flex-col justify-between md:justify-around text-end w-max items-end">
                {isLoading === true && (<Bar barClassName="w-10 h-3" />)}
                {!isLoading && (<div className=" w-max items-end">{rate}</div>)}

                {isLoading === true && (<Bar barClassName="w-16 h-2.5" />)}
                {!isLoading && rateDescription && (<div className="w-max font-normal text-[8px] md:text-xs text-muted-foreground">{rateDescription}</div>)}
            </div>
        </div>
    )
}

export default InfoCard
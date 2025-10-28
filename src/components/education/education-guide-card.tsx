import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import BaseCard from "../common/base-card";
import Bar from "../common/skeleton/bar";
import Divider from "../common/divider";
import { RxExternalLink } from "react-icons/rx";


interface EducationGuideCardProps {
    title: string;
    category: string;
    categoryClassName: string;
    className?: string;
    summary: string;
    content: string;
    isLoading?: boolean;
    quickOverviews: Array<string>;
}

const EducationGuideCard = ({isLoading, title, category, summary, content, quickOverviews, categoryClassName, className}: EducationGuideCardProps) => {

    const [isShow, setIsShow] = useState(false);

    const showDetail = () => {
        setIsShow(!isShow)
    }
    return (
        <BaseCard className={`pb-3.5 flex flex-col gap-2.5 ${className} h-fit`}>
            <div className="flex justify-between">
                <div className="flex flex-col gap-3 items-start">
                    <div className={`text-xs px-3 rounded-xs font-medium border ${categoryClassName}`}>
                        {isLoading && <Bar barClassName="w-10 h-3" />}
                        {!isLoading && category}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm text-foreground font-semibold">
                            {isLoading && <Bar barClassName="w-30 h-3" />}
                            {!isLoading && title}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium w-full lg:w-100 2xl:w-130">
                            {isLoading && <Bar barClassName="w-60 h-3" />}
                            {!isLoading && summary}
                        </div>
                    </div>
                </div>
                <div className={`flex items-center justify-center h-[24px] w-[24px] transition-transform duration-300 origin-center ${!isLoading && isShow ? "rotate-180" : "rotate-0"}`} onClick={showDetail}>
                    <IoChevronDown size={20} />
                </div>
            </div>
            <div
                className={`transition-all duration-300 ${!isLoading && isShow ? 'opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {!isLoading && isShow && (
                    <div className="flex flex-col gap-6 py-6">
                        <Divider />
                        <div className="text-xs text-muted-foreground">
                            {content}
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-sm text-foreground font-semibold">
                                Quick Overview
                            </div>
                            <div className="flex flex-col">
                                {quickOverviews.map((overview, index) => {
                                    return (
                                        <div key={index} className="flex gap-2">
                                            <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                                            <div className="text-xs text-muted-foreground">
                                                {overview}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="flex gap-3 items-center w-full justify-center">
                            <div className="text-base text-foreground font-semibold">Ask AI for more Details</div>
                            <RxExternalLink size={16} />
                        </div>
                    </div>
                )}
            </div>
        </BaseCard>
    )
}

export default EducationGuideCard
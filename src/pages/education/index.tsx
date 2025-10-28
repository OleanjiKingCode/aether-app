import EducationAskAIAssistance from "@/components/education/education-ask-ai-assistance"
import EducationGuides from "@/components/education/education-guides"
import { useEffect, useState } from "react"

const Education = () => {

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }, [])
    return (
        <div className="ml-0 sm:ml-50">
            <div className="flex xl:items-center flex-col gap-1 xl:flex-row justify-between px-6 md:px-8 py-4.5 border-y-[1px] border-input">
                <div className="flex flex-col gap-y-1.5">
                    <b className="text-foreground">Education</b>
                    <p className="text-muted-foreground text-xs h-11 w-full xl:w-175 md:h-10 md:text-sm">
                        Learn DeFi fundamentals, trading strategies, and security best practices.
                    </p>
                </div>
            </div>
            <div className="md:p-[32px] p-5 flex flex-col md:gap-[24px] gap-[16px]">
                <EducationGuides />
                <EducationAskAIAssistance isLoading={isLoading}/>
            </div>
        </div>
    )
}

export default Education
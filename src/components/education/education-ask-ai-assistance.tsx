import Image from "next/image"
import BaseCard from "../common/base-card"
import QuestionMarkIcon from "public/icon/education/education-question-mark-icon.svg"
import AskAIIcon from "public/icon/education/education-ask-ai-button-icon.svg"
import Bar from "../common/skeleton/bar"

interface EducationAskAIAssistanceProps {
    isLoading?: boolean
}

const EducationAskAIAssistance = ({ isLoading }: EducationAskAIAssistanceProps) => {
    return (
        <BaseCard className="p-8">
            <div className="py-5 flex w-full flex-col items-center justify-center gap-5">
                {isLoading && <Bar barClassName="w-12.5 h-12.5" />}
                {!isLoading && <Image src={QuestionMarkIcon} width={50} height={50} alt="" />}
                <div className="flex flex-col gap-1.5 xl:w-175 items-center justify-center text-center">
                    {isLoading && <Bar barClassName="w-50 h-3" />}
                    {!isLoading && <div className="text-base text-foreground font-semibold">Need personalized guidance?</div>}

                    {isLoading && <Bar barClassName="w-60 h-3" />}
                    {!isLoading && <div className="text-sm text-muted-foreground">Our AI assistant can provide tailored explanations and answer specific questions about any topic.</div>}
                </div>
                <button className="gradient-bg flex text-xs font-semibold items-center px-4 py-[9px] text-white gap-1 cursor-pointer">
                    {isLoading && <Bar barClassName="w-5 h-5" />}
                    {!isLoading && <Image src={AskAIIcon} width={16} height={16} alt="" />}
                    
                    {isLoading && <Bar barClassName="w-10 h-3" />}
                    {!isLoading && "Ask AI Assistance"}
                </button>
            </div>
        </BaseCard>
    )
}

export default EducationAskAIAssistance
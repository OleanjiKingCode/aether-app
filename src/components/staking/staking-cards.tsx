import AIRecommendationAlert from "../common/ai-recommendation-alert"
import { useEffect, useState } from "react";
import StakingCard from "./staking-card";
import StakedIcon from "public/icon/stake/staked-icon.svg"
import APYRangeIcon from "public/icon/stake/apy-range-icon.svg"
import TotalValueIcon from "public/icon/stake/total-value-locked-icon.svg"
import AvaliableBalanceIcon from "public/icon/stake/available-balance-icon.svg"

const StakingCards = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }, [])

    const cardData = [
        {
            title: "Your Staked Balance",
            content: "5,000",
            description: "AETH • $15,050.00",
            additionalDescription: "0.15% of total pool",
            descriptionClassName: "!text-secondary",
            additionalDescriptionClassName: "",
            icon: StakedIcon
        },
        {
            title: "APY Range",
            content: "8.5% - 15.5%",
            description: "Based on duration",
            additionalDescription: "Auto-compound ON",
            descriptionClassName: "!text-green-600",
            additionalDescriptionClassName: "",
            icon: APYRangeIcon
        },
        {
            title: "Total Value Locked",
            content: "$8.4M",
            description: "3,247 stakers",
            additionalDescription: "Unbonding: 7 days",
            descriptionClassName: "",
            additionalDescriptionClassName: "!text-secondary",
            icon: TotalValueIcon
        },
        {
            title: "Available Balance",
            content: "1,250",
            description: "AETH • $3,766.25",
            additionalDescription: "Ready to stake",
            descriptionClassName: "",
            additionalDescriptionClassName: "",
            icon: AvaliableBalanceIcon
        },
    ]
    return (
        <div className="flex flex-col gap-6">
            <AIRecommendationAlert isLoading={isLoading} description="Stake your available 1,250 AETH in 30-day pool for 10.2% APY or 180-day pool for 15.5% APY - Choose your preferred duration for optimal rewards" />
            <div className="flex flex-col xl:flex-row justify-between gap-6">
                {cardData.map((card, index) => (
                    <StakingCard key={index} title={card.title} content={card.content} description={card.description} descriptionClassName={card.descriptionClassName} additionalDescription={card.additionalDescription} additionalDescriptionClassName={card.additionalDescriptionClassName} icon={card.icon} />
                ))}
            </div>
        </div>
    )
}

export default StakingCards
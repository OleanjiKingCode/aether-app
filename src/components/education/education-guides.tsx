import { useEffect, useState } from "react"
import EducationGuideSearch from "./education-guide-search"
import EducationBookIcon from "public/icon/education/education-book-icon.svg"
import Image from "next/image";
import EducationGuideCard from "./education-guide-card";

const EducationGuides = () => {
    const [category, setCategory] = useState(-1)
    const [keyword, setKeyword] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    })
    const guides = [
        {
            title: 'Privacy Mode & Zero-Knowledge Trading',
            category: 'Article',
            categoryClassName: 'bg-[#80008033] border-purple-500 text-purple-500',
            summary: 'Understand the fundamental building blocks of decentralized finance protocols.',
            content: 'Privacy Mode uses zero-knowledge proofs to hide your transaction details while still allowing the network to verify their validity. This protects you from MEV (Maximal Extractable Value) attacks, front-running, and competitive analysis of your trading strategies.',
            quickOverviews: [
                "Protects against sandwich attacks and front-running",
                "ZK-SNARKs enable private verification without revealing data"
            ]
        },
        {
            title: 'Cross-chain arbitrage opportunities',
            category: 'Strategy',
            categoryClassName: 'bg-[#F6339A33] border-pink-500 text-pink-500',
            summary: 'Identify and capitalize on price differences across different blockchain networks...',
            content: 'Privacy Mode uses zero-knowledge proofs to hide your transaction details while still allowing the network to verify their validity. This protects you from MEV (Maximal Extractable Value) attacks, front-running, and competitive analysis of your trading strategies.',
            quickOverviews: [
                "Protects against sandwich attacks and front-running",
                "ZK-SNARKs enable private verification without revealing data"
            ]
        },
        {
            title: 'How to use ZK-SNARK privacy on AetherDEX',
            category: 'Tutorial',
            categoryClassName: 'bg-[#FB9B0033] border-border text-secondary',
            summary: 'Step-by-step guide to enabling zero-knowledge privacy for your trades while maintaining full security...',
            content: 'Privacy Mode uses zero-knowledge proofs to hide your transaction details while still allowing the network to verify their validity. This protects you from MEV (Maximal Extractable Value) attacks, front-running, and competitive analysis of your trading strategies.',
            quickOverviews: [
                "Protects against sandwich attacks and front-running",
                "ZK-SNARKs enable private verification without revealing data"
            ]
        },
        {
            title: 'Privacy Mode & Zero-Knowledge Trading',
            category: 'Analysis',
            categoryClassName: 'bg-[#0000FF33] border-blue-500 text-blue-500',
            summary: 'Essential security practices for protecting your crypto assets and managing DeFi risks effectively.',
            content: 'Privacy Mode uses zero-knowledge proofs to hide your transaction details while still allowing the network to verify their validity. This protects you from MEV (Maximal Extractable Value) attacks, front-running, and competitive analysis of your trading strategies.',
            quickOverviews: [
                "Protects against sandwich attacks and front-running",
                "ZK-SNARKs enable private verification without revealing data"
            ]
        },
        {
            title: 'Privacy Mode & Zero-Knowledge Trading',
            category: 'Guide',
            categoryClassName: 'bg-[#00C95133] border-green-500 text-green-500',
            summary: 'Optimize your staking strategy to earn maximum rewards while participating in governance...',
            content: 'Privacy Mode uses zero-knowledge proofs to hide your transaction details while still allowing the network to verify their validity. This protects you from MEV (Maximal Extractable Value) attacks, front-running, and competitive analysis of your trading strategies.',
            quickOverviews: [
                "Protects against sandwich attacks and front-running",
                "ZK-SNARKs enable private verification without revealing data"
            ]
        },
        {
            title: 'Understanding AI & DePIN Tokens',
            category: 'Article',
            categoryClassName: 'bg-[#80008033] border-purple-500 text-purple-500',
            summary: 'Learn about the intersection of artificial intelligence and decentralized physical infrastructure networks.',
            content: 'Privacy Mode uses zero-knowledge proofs to hide your transaction details while still allowing the network to verify their validity. This protects you from MEV (Maximal Extractable Value) attacks, front-running, and competitive analysis of your trading strategies.',
            quickOverviews: [
                "Protects against sandwich attacks and front-running",
                "ZK-SNARKs enable private verification without revealing data"
            ]
        },
        {
            title: 'Privacy Mode & Zero-Knowledge Trading',
            category: 'Analysis',
            categoryClassName: 'bg-[#0000FF33] border-blue-500 text-blue-500',
            summary: "Master AetherDEX's privacy features to protect your trades from MEV attacks and front-running.",
            content: 'Privacy Mode uses zero-knowledge proofs to hide your transaction details while still allowing the network to verify their validity. This protects you from MEV (Maximal Extractable Value) attacks, front-running, and competitive analysis of your trading strategies.',
            quickOverviews: [
                "Protects against sandwich attacks and front-running",
                "ZK-SNARKs enable private verification without revealing data"
            ]
        },
        {
            title: 'Advanced Trading Strategies',
            category: 'Strategy',
            categoryClassName: 'bg-[#F6339A33] border-pink-500 text-pink-500',
            summary: "Leverage AetherDEX's AI features and cross-chain capabilities for sophisticated trading approaches.",
            content: 'Privacy Mode uses zero-knowledge proofs to hide your transaction details while still allowing the network to verify their validity. This protects you from MEV (Maximal Extractable Value) attacks, front-running, and competitive analysis of your trading strategies.',
            quickOverviews: [
                "Protects against sandwich attacks and front-running",
                "ZK-SNARKs enable private verification without revealing data"
            ]
        }
    ]
    return (
        <div className="flex flex-col gap-6">
            <EducationGuideSearch keyword={keyword} setKeyword={setKeyword} category={category} setCategory={setCategory} />
            <div className="flex gap-2 items-center">
                <Image src={EducationBookIcon.src} width={16} height={16} alt="" />
                <div className="text-sm text-foreground font-semibold">Tutorial And Guides</div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {guides.map((guide, index) => {
                    return (
                        <EducationGuideCard isLoading={isLoading} title={guide.title} category={guide.category} categoryClassName={guide.categoryClassName} summary={guide.summary} content={guide.content} quickOverviews={guide.quickOverviews}/>
                    )
                })}
            </div>
        </div>
    )
}

export default EducationGuides
import PortfolioDashboardIcon from "public/icon/portfolio/portfolio-dashboard-icon.svg"
import ReadyDescriptionCard from "../common/ready-description-card"
import AnalysticsIcon from "public/icon/portfolio/dashboard-analytics-icon.svg"
import MultiChainIcon from "public/icon/portfolio/dashboard-multi-chain-icon.svg"
import ReadyToStartDashboard from "../common/ready-to-start-dashboard"

const ReadyToStart = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="p-6 border-input border-[1px] bg-card w-full max-w-250 xl:max-w-full ">
                <ReadyToStartDashboard icon={PortfolioDashboardIcon.src} title="Your Portfolio Dashboard" content="Connect your wallet to view your token holdings, track performance across chains, monitor staking rewards, and get AI-powered insights on your DeFi investments." />
            </div>
            <div className="flex justify-between gap-6 flex-col 2xl:flex-row">
                <ReadyDescriptionCard title="Multi-Chain Tracking" content="Monitor your assets across Ethereum, Solana, and other supported chains in one unified dashboard." icon={MultiChainIcon.src} />
                <ReadyDescriptionCard title="Performance Analytics" content="Get detailed insights on your token performance, price movements, and portfolio allocation." icon={AnalysticsIcon.src} />
            </div>
        </div>
    )
}

export default ReadyToStart
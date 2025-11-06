import Image from "next/image"
import ConnectWallet from "../connect-wallet.tsx"
import SwapIcon from "public/icon/swap-icon.svg"
import AIRouteIcon from "public/icon/swap/stars-yellow-icon.svg"
import CrossChainIcon from "public/icon/swap/fast-cross-icon.svg"
import PrivacyIcon from "public/icon/swap/privacy-icon.svg"
import ReadyDescriptionCard from "../common/ready-description-card"
import ReadyToStartDashboard from "../common/ready-to-start-dashboard"

const ReadyToStart = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="p-6 border-input border-[1px] bg-card w-full max-w-250 xl:max-w-full ">
                <ReadyToStartDashboard icon={SwapIcon.src} title="Ready to start Trading?" content="Connect your wallet to access AI-powered token swaps with cross-chain bridging, privacy protection, and MEV shielding. Trade any token across Solana and Ethereum with optimal routing." />
            </div>
            <div className="flex justify-between gap-6 flex-col 2xl:flex-row">
                <ReadyDescriptionCard title="AI Route Optimization" content="Our AI finds the best routes across DEXes to minimize fees and slippage" icon={AIRouteIcon.src} />
                <ReadyDescriptionCard title="Fast Cross-Chain" content="Trade privately using ZK-SNARKs to keep your transactions confidential" icon={CrossChainIcon.src} />
                <ReadyDescriptionCard title="Privacy Mode" content="Trade privately using ZK-SNARKs to keep your transactions confidential" icon={PrivacyIcon.src} />
            </div>
        </div>
    )
}

export default ReadyToStart
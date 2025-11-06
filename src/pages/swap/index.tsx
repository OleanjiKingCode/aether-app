import Badge from "@/components/common/badge"
import MainPanel from "@/components/swap/main-panel"
import ReadyToStart from "@/components/swap/ready-to-start"
import ExcutionIcon from "public/icon/execution-icon.svg"
import StarsIcon from "public/icon/stars-icon.svg"
import { useWalletContext } from "@/context/WalletContext"

const Swap = () => {
    const { isConnected } = useWalletContext()
    return (
        <div className="ml-0 sm:ml-50">
            <div className="flex items-center px-6 md:px-8 py-4.5 border-y-[1px] border-input">
                <div className="flex flex-col gap-y-1.5">
                    <b className="text-foreground">Swap</b>
                    <p className="text-muted-foreground text-xs h-11 md:h-10 md:text-sm">
                        Trade tokens across Solana and Ethereum with AI-optimized routing and privacy protection.
                    </p>
                    <div className="grid grid-cols-2 md:flex gap-3 mt-1.5">
                        <Badge icon={ExcutionIcon.src} title="~25s Execution" />
                        <Badge icon={StarsIcon.src} title="AI Powered" />
                        <Badge icon={StarsIcon.src} title="0.2% fee" />
                        <Badge icon={StarsIcon.src} title="Cross-chain" />
                    </div>
                </div>
            </div>
            <div className="md:p-[32px] p-5 flex flex-col md:gap-[24px] gap-[16px]">
                {!isConnected && (
                    <ReadyToStart />
                )}
                {isConnected && (
                    <MainPanel />
                )}
            </div>
        </div>
    )
}

export default Swap
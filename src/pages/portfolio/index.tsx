import PortfolioMain from "@/components/portfolio/portfolio-main"
import ReadyToStart from "@/components/portfolio/ready-to-start"
import { useWalletContext } from "@/context/WalletContext"

const Portfolio = () => {
    const { isConnected } = useWalletContext()
    return (
        <div className="ml-0 sm:ml-50">
            <div className="flex items-center px-6 md:px-8 py-4.5 border-y-[1px] border-input">
                <div className="flex flex-col gap-y-1.5">
                    <b className="text-foreground">Portfolio</b>
                    <p className="text-muted-foreground text-xs h-11 md:h-10 md:text-sm">
                        Track your DeFi assets, performance, and rewards.
                    </p>
                </div>
            </div>
            <div className="md:p-[32px] p-5 flex flex-col md:gap-[24px] gap-[16px]">
                {!isConnected && (
                    <ReadyToStart />
                )}
                {isConnected && (
                    <PortfolioMain />
                )}
            </div>
        </div>
    )
}

export default Portfolio
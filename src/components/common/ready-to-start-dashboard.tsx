import Image from "next/image"
import ConnectWallet from "../connect-wallet.tsx"
import UnifiedWallet from "../unified-wallet"

interface ReadyToStartDashboardProps {
    icon: string,
    title: string,
    content: string
}

const ReadyToStartDashboard = ({ icon, title, content }: ReadyToStartDashboardProps) => {
    return (
        <div className="flex flex-col gap-5 w-full items-center justify-center text-center mt-10 h-128">
            <div className="rounded-full bg-[#FB9B0033] w-30 h-30 flex items-center justify-center">
                <Image src={icon} alt="" height={64} width={64} />
            </div>
            <div className="flex flex-col gap-1.5 w-full items-center justify-center text-center">
                <div className="text-foreground text-base font-normal font-geist-mono">
                    {title}
                </div>
                <div className="text-sm text-muted-foreground font-geist-mono max-w-[833px]">
                    {content}
                </div>
            </div>
            <div>
                <UnifiedWallet isShowAddressInMobile={true} />
            </div>
        </div>
    )
}

export default ReadyToStartDashboard
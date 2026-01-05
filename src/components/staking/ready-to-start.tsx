import StakeDashboardIcon from "public/icon/stake/stake-dashboard-icon.svg"
import ReadyDescriptionCard from "../common/ready-description-card"
import UpToAPYIcon from "public/icon/stake/up-to-apy-icon.svg"
import GovernanceIcon from "public/icon/stake/governance-icon.svg"
import FlexibleTermsIcon from "public/icon/stake/flexible-terms-icon.svg"
import ReadyToStartDashboard from "../common/ready-to-start-dashboard"

const ReadyToStart = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="p-6 border-input border-[1px] bg-card w-full max-w-250 xl:max-w-full ">
                <ReadyToStartDashboard icon={StakeDashboardIcon} title="Start Earning Rewards" content="Connect your wallet to stake AETH tokens, earn up to 15.2% APY, and unlock governance rights. Choose from flexible staking periods with bonus multipliers." />
            </div>
            <div className="flex justify-between gap-6 flex-col 2xl:flex-row">
                <ReadyDescriptionCard title="Up to 15.2% APY" content="Earn competitive rewards with longer staking periods offering higher APY rates" icon={UpToAPYIcon} />
                <ReadyDescriptionCard title="Governance Power" content="Participate in protocol decisions and vote on important proposals" icon={GovernanceIcon} />
                <ReadyDescriptionCard title="Flexible Terms" content="Choose from 1 month to 1 year staking periods with bonus multipliers" icon={FlexibleTermsIcon} />
            </div>
        </div>
    )
}

export default ReadyToStart
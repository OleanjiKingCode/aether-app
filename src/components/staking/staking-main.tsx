import StakingCards from "./staking-cards";
import StakingMainPanel from "./staking-main-panel";

const StakingMain = () => {
    return (
        <div className="flex flex-col gap-6">
            <StakingCards />
            <StakingMainPanel />
        </div>
    )
}

export default StakingMain;
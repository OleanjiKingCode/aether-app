import GovernanceDashboardIcon from "public/icon/governance/governance-dashboard-icon.svg";
import ReadyDescriptionCard from "../common/ready-description-card";
import GovernanceVoteIcon from "public/icon/governance/governance-user-vote-icon.svg";
import GovernanceTransparentIcon from "public/icon/governance/governance-transparent-icon.svg";
import GovernanceProtocolIcon from "public/icon/governance/governance-trend-up-icon.svg";
import ReadyToStartDashboard from "../common/ready-to-start-dashboard";

const ReadyToStart = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 border-input border-[1px] bg-card w-full max-w-250 xl:max-w-full ">
        <ReadyToStartDashboard
          icon={GovernanceDashboardIcon.src}
          title="Join the Governance"
          content="Connect your wallet to view active proposals, cast votes, and participate in shaping AetherDEX's future. Your staked AETH tokens give you voting power."
        />
      </div>
      <div className="flex justify-between gap-6 flex-col 2xl:flex-row">
        <ReadyDescriptionCard
          title="Democratic Voting"
          content="Every AETH holder has a voice in protocol decisions"
          icon={GovernanceVoteIcon.src}
        />
        <ReadyDescriptionCard
          title="Transparent Process"
          content="All proposals and votes are recorded on-chain"
          icon={GovernanceTransparentIcon.src}
        />
        <ReadyDescriptionCard
          title="Protocol Evolution"
          content="Help guide new features and protocol improvements"
          icon={GovernanceProtocolIcon.src}
        />
      </div>
    </div>
  );
};

export default ReadyToStart;

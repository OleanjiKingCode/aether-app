import React, { useState } from "react";
import BaseCard from "../common/base-card";
import { IoChevronDown } from "react-icons/io5";
import { MdInfoOutline } from "react-icons/md";
import VotingPowerIcon from "public/icon/governance/governance-voting-power-icon.svg"
import QuorumRequirementsIcon from "public/icon/governance/quorum-requirements-icon.svg"
import VotingPeriodIcon from "public/icon/governance/voting-period-icon.svg"
import AutoExecutionIcon from "public/icon/governance/auto-execution-icon.svg"
import Image from "next/image";
import Divider from "../common/divider";
import { FiCheckCircle } from "react-icons/fi";
import { FiMinusCircle } from "react-icons/fi";
import Bar from "../common/skeleton/bar";
import { RxExternalLink } from "react-icons/rx";

interface GovernanceAccordionProps {
    isLoading?: boolean
}

const GovernanceAccordion = ({ isLoading }: GovernanceAccordionProps) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(-1);

    const toggle = (index: number) => {
        setExpandedIndex(prev => (prev === index ? null : index));
    };

    return (
        <BaseCard className="p-6">
            <div className={`w-full`}>
                <div className={`${expandedIndex === 0 ? '' : 'border border-input'} mb-2 overflow-hidden`}>
                    <button
                        type="button"
                        aria-expanded={expandedIndex === 0}
                        onClick={() => toggle(0)}
                        className="w-full flex justify-between items-center px-4 py-3 bg-transparent hover:bg-[#0b0c18] text-left"
                    >
                        {isLoading && <Bar barClassName="w-30 h-3" />}
                        {isLoading && <Bar barClassName="w-3 h-3" />}
                        {!isLoading && <div className="flex gap-1.5 items-center">
                            <div>
                                <MdInfoOutline className="text-secondary" size={20} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-base text-foreground font-semibold">
                                    How Governance Works
                                </div>
                                <div className="text-xs text-muted-foreground font-medium">
                                    Your Guide to voting
                                </div>
                            </div>
                        </div>}
                        {!isLoading && <div className={`flex items-center justify-center h-[24px] w-[24px] transition-transform duration-300 origin-center ${expandedIndex === 0 ? "rotate-180" : "rotate-0"}`}>
                            <IoChevronDown size={20} />
                        </div>}
                    </button>

                    {expandedIndex === 0 && (
                        <div className="py-6 flex flex-col gap-3">
                            <div className="flex gap-2 items-start">
                                <Image src={VotingPowerIcon} width={24} height={24} alt="" />
                                <div className="flex flex-col gap-2">
                                    <div className="text-xs text-foreground font-semibold">
                                        Voting Power
                                    </div>
                                    <div className="text-xs text-muted-foreground opacity-80">
                                        Your voting power equals your staked AETH tokens. <span className="text-primary">More stake = more influence</span> in decisions.
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-start">
                                <Image src={QuorumRequirementsIcon} width={24} height={24} alt="" />
                                <div className="flex flex-col gap-2">
                                    <div className="text-xs text-foreground font-semibold">
                                        Quorum Requirements
                                    </div>
                                    <div className="text-xs text-muted-foreground opacity-80">
                                        Proposals need <span className="text-primary">1M+ votes</span> to pass.
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-start">
                                <Image src={VotingPeriodIcon} width={24} height={24} alt="" />
                                <div className="flex flex-col gap-2">
                                    <div className="text-xs text-foreground font-semibold">
                                        Voting Period
                                    </div>
                                    <div className="text-xs text-muted-foreground opacity-80">
                                        Each proposal has a <span className="text-primary">7-day voting window</span>. Vote early for rewards.
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 items-start">
                                <Image src={AutoExecutionIcon} width={24} height={24} alt="" />
                                <div className="flex flex-col gap-2">
                                    <div className="text-xs text-foreground font-semibold">
                                        Auto Execution
                                    </div>
                                    <div className="text-xs text-muted-foreground opacity-80">
                                        Passed proposals are <span className="text-green-500">automatically executed</span> by smart contracts.
                                    </div>
                                </div>
                            </div>
                            <Divider className="mt-3" />
                        </div>
                    )}
                </div>
                <div className={`${expandedIndex === 1 ? '' : 'border border-input'} mb-2 overflow-hidden`}>
                    <button
                        type="button"
                        aria-expanded={expandedIndex === 1}
                        onClick={() => toggle(1)}
                        className="w-full flex justify-between items-center px-3 py-3 bg-transparent hover:bg-[#0b0c18] text-left"
                    >
                        {isLoading && <Bar barClassName="w-30 h-3" />}
                        {isLoading && <Bar barClassName="w-3 h-3" />}
                        {!isLoading && <div className="text-base text-foreground font-semibold">
                            Proposal Categories
                        </div>}
                        {!isLoading && <div className={`flex items-center justify-center h-[24px] w-[24px] transition-transform duration-300 origin-center ${expandedIndex === 1 ? "rotate-180" : "rotate-0"}`}>
                            <IoChevronDown size={20} />
                        </div>}
                    </button>
                    {expandedIndex === 1 && (
                        <div className="py-6 flex flex-col gap-2.5">
                            <BaseCard className="px-3 py-2.5 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                                <div className="text-xs font-medium text-primary">Chain Integration -</div>
                                <div className="text-xs text-muted-foreground opacity-80">Add new blockchains</div>
                            </BaseCard>
                            <BaseCard className="px-3 py-2.5 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-secondary rounded-full" />
                                <div className="text-xs font-medium text-secondary">Protocol Updates -</div>
                                <div className="text-xs text-muted-foreground opacity-80">Core functionality changes</div>
                            </BaseCard>
                            <BaseCard className="px-3 py-2.5 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                                <div className="text-xs font-medium text-green-500">Treasury Management -</div>
                                <div className="text-xs text-muted-foreground opacity-80">Fund allocation</div>
                            </BaseCard>
                            <BaseCard className="px-3 py-2.5 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                                <div className="text-xs font-medium text-blue-500">Governance -</div>
                                <div className="text-xs text-muted-foreground opacity-80">Voting rule changes</div>
                            </BaseCard>
                        </div>
                    )}
                </div>
                <div className={`${expandedIndex === 2 ? '' : 'border border-input'} mb-2 overflow-hidden`}>
                    <button
                        type="button"
                        aria-expanded={expandedIndex === 2}
                        onClick={() => toggle(2)}
                        className="w-full flex justify-between items-center px-3 py-3 bg-transparent hover:bg-[#0b0c18] text-left"
                    >
                        {isLoading && <Bar barClassName="w-30 h-3" />}
                        {isLoading && <Bar barClassName="w-3 h-3" />}
                        {!isLoading && <div className="text-base text-foreground font-semibold">
                            Voting Options
                        </div>}
                        {!isLoading && <div className={`flex items-center justify-center h-[24px] w-[24px] transition-transform duration-300 origin-center ${expandedIndex === 2 ? "rotate-180" : "rotate-0"}`}>
                            <IoChevronDown size={20} />
                        </div>}
                    </button>
                    {expandedIndex === 2 && (
                        <div className="py-6 flex flex-col gap-2.5">
                            <BaseCard className="px-3 py-2.5 flex items-center gap-2">
                                <FiCheckCircle className="text-green-500" size={16} />
                                <div className="flex flex-col gap-1">
                                    <div className="text-xs font-medium text-green-500">Yes Vote</div>
                                    <div className="text-xs text-muted-foreground opacity-80">Add new blockchains</div>
                                </div>
                            </BaseCard>
                            <BaseCard className="px-3 py-2.5 flex items-center gap-2">
                                <MdInfoOutline className="text-red-500" size={16} />
                                <div className="flex flex-col gap-1">
                                    <div className="text-xs font-medium text-red-500">No Vote</div>
                                    <div className="text-xs text-muted-foreground opacity-80">Add new blockchains</div>
                                </div>
                            </BaseCard>
                            <BaseCard className="px-3 py-2.5 flex items-center gap-2">
                                <FiMinusCircle className="text-foreground" size={16} />
                                <div className="flex flex-col gap-1">
                                    <div className="text-xs font-medium text-foreground">Abstain</div>
                                    <div className="text-xs text-muted-foreground opacity-80">Add new blockchains</div>
                                </div>
                            </BaseCard>
                        </div>
                    )}
                </div>
                <div className={`${expandedIndex === 3 ? '' : 'border border-input'} mb-2 overflow-hidden`}>
                    <button
                        type="button"
                        aria-expanded={expandedIndex === 3}
                        onClick={() => toggle(3)}
                        className="w-full flex justify-between items-center px-3 py-3 bg-transparent hover:bg-[#0b0c18] text-left"
                    >
                        {isLoading && <Bar barClassName="w-30 h-3" />}
                        {isLoading && <Bar barClassName="w-3 h-3" />}
                        {!isLoading && <div className="text-base text-foreground font-semibold">
                            Voting Requirements
                        </div>}
                        {!isLoading && <div className={`flex items-center justify-center h-[24px] w-[24px] transition-transform duration-300 origin-center ${expandedIndex === 3 ? "rotate-180" : "rotate-0"}`}>
                            <IoChevronDown size={20} />
                        </div>}
                    </button>
                    {expandedIndex === 3 && (
                        <div className="py-6 flex flex-col gap-2.5">
                            <BaseCard className="px-3 py-2.5 flex flex-col gap-1">
                                <div className="flex justify-between">
                                    <div className="text-xs font-medium text-foreground">Minimum Stake to Vote</div>
                                    <div className="bg-[#FB9B0033] px-3 py-0 h-fit border border-secondary rounded-xs text-xs text-secondary font-medium">
                                        100 AETH
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground opacity-80">Required to participate in governance voting</div>
                            </BaseCard>
                            <BaseCard className="px-3 py-2.5 flex flex-col gap-1">
                                <div className="flex justify-between">
                                    <div className="text-xs font-medium text-foreground">Proposal Creation</div>
                                    <div className="bg-[#FB9B0033] px-3 py-0 h-fit border border-secondary rounded-xs text-xs text-secondary font-medium">
                                        10,000 AETH
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground opacity-80">Minimum stake required to submit new proposals</div>
                            </BaseCard>
                            <BaseCard className="px-3 py-2.5 flex flex-col gap-1">
                                <div className="flex justify-between">
                                    <div className="text-xs font-medium text-foreground">Voting Rewards</div>
                                    <div className="bg-[#00800033] px-3 py-0 h-fit border border-green-500 rounded-xs text-xs text-green-500 font-medium">
                                        0.1-2.5 AETH
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground opacity-80">Earned for active participation in governance</div>
                            </BaseCard>
                        </div>
                    )}
                </div>
                <div className="flex gap-3 items-center w-full justify-center mt-6">
                    <div className="text-base text-foreground font-semibold">Learn more about Governance</div>
                    <RxExternalLink size={16} />
                </div>
            </div>
        </BaseCard>

    );
};

export default GovernanceAccordion;
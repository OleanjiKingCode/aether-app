import { FiCheckCircle } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import BaseCard from "../common/base-card"
import { FaCalendarAlt } from "react-icons/fa";
import { Progressbar } from "../common/progresbar";
import Divider from "../common/divider";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Bar from "../common/skeleton/bar";

const GovernanceActiveProposals = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])
    const activeProposals = [
        {
            number: 'AIP-004',
            title: 'Reduce Cross-Chain Bridge Fees by 50%',
            type: 'protocol',
            status: 'Active',
            description: 'Proposal to increase the AETH staking APY from 10.5% to 12% to attract more stakers and improve network security.',
            createdAt: '2024-06-10',
            period: '5 days Left',
            now: 155000,
            min: 0,
            max: 200000,
            for: 125000,
            against: 25000,
            abstain: 5000,
            votingPower: 1250,
            voted: '',
        },
        {
            number: 'AIP-003',
            title: 'Integrate ZETA Chain for Enhanced Interoperability',
            type: 'chain',
            status: 'Active',
            description: 'Proposal to integrate ZETA Chain to enable seamless asset transfers and expand the AetherDEX ecosystem.',
            createdAt: '2024-07-01',
            period: '3 days Left',
            now: 165000,
            min: 0,
            max: 200000,
            for: 135000,
            against: 25000,
            abstain: 5000,
            votingPower: 1250,
            voted: '',
        },
        {
            number: 'AIP-002',
            title: 'Adjust Gas Limit for Smart Contract Deployments',
            type: 'protocol',
            status: 'Passed',
            description: 'Proposal to adjust the gas limit for smart contract deployments to optimize transaction costs and efficiency.',
            createdAt: '2024-06-28',
            period: '2 days Left',
            now: 180000,
            min: 0,
            max: 200000,
            for: 160000,
            against: 15000,
            abstain: 5000,
            voted: 'For',
            votingPower: 0
        },
        {
            number: 'AIP-001',
            title: 'Refine Tokenomics for Enhanced Utility',
            type: 'tokenomics',
            status: 'Rejected',
            description: 'Proposal to refine the tokenomics model to increase token utility and incentivize long-term holding.',
            createdAt: '2024-06-29',
            period: '1 days Left',
            now: 190000,
            min: 0,
            max: 200000,
            for: 80000,
            against: 90000,
            abstain: 20000,
            votingPower: 0,
            voted: 'Against'
        }

    ]
    // const activeProposals : any = []
    return (
        <BaseCard className="p-6 flex flex-col gap-5">
            <div className="flex gap-2 items-center h-10">
                {isLoading && (<Bar barClassName="h-4 w-4" />)}
                {!isLoading && <FiCheckCircle size={16} />}

                {isLoading && (<Bar barClassName="h-3 w-20" />)}
                {!isLoading && <div className="text-sm text-foreground font-semibold">
                    Active Proposals
                </div>}
            </div>
            {isLoading && 
                [...Array(5)].map((_, i) => (
                <BaseCard className="px-3 py-6">
                    <div className="flex gap-2 items-center">
                        <Bar barClassName="h-3 w-50" />
                        <div className="flex flex-col xl:flex-row gap-2">
                            <div className="h-fit rounded-xs border bg-[#80008033] border-purple-500 text-xs px-3">
                                <Bar barClassName="h-3 w-12" />
                            </div>
                            <div className={`h-fit rounded-xs border border-green-500 bg-green-500 opacity-80 text-xs px-3`}>
                                <Bar barClassName="h-3 w-12" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 w-full xl:w-130 text-xs text-muted-foreground">
                        <Bar barClassName="h-3 w-50" />
                    </div>
                    <div className="mt-3 flex gap-4 w-max">
                        <div className="flex gap-1 items-center">
                            <Bar barClassName="h-3 w-3" />
                            <Bar barClassName="h-3 w-13" />
                        </div>
                        <div className="flex gap-1 items-center">
                            <Bar barClassName="h-3 w-3" />
                            <Bar barClassName="h-3 w-13" />
                        </div>
                    </div>
                    <div className="mt-3 flex flex-col gap-2.5">
                        <div className="flex justify-between">
                            <Bar barClassName="h-3 w-60" />
                            <Bar barClassName="h-3 w-5" />
                        </div>
                        <Bar barClassName="h-3 w-full" />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-5 xl:grid-cols-3 justify-between items-start text-start mt-4.5">
                        <div className="flex flex-col gap-2 items-start justify-start w-[150px]">
                            <div className="flex gap-1 items-center">
                                <Bar barClassName="h-3 w-3" />
                                <Bar barClassName="h-3 w-10" />
                            </div>
                            <Bar barClassName="h-3 w-5" />
                        </div>
                        <div className="flex flex-col gap-2 items-start justify-start w-[150px]">
                            <div className="flex gap-1 items-center">
                                <Bar barClassName="h-3 w-3" />
                                <Bar barClassName="h-3 w-10" />
                            </div>
                            <Bar barClassName="h-3 w-5" />
                        </div>
                        <div className="flex flex-col gap-2 items-start justify-start w-[150px]">
                            <div className="flex gap-1 items-center">
                                <Bar barClassName="h-3 w-3" />
                                <Bar barClassName="h-3 w-10" />
                            </div>
                            <Bar barClassName="h-3 w-5" />
                        </div>
                    </div>
                    <Divider className="mt-3" />
                    <div className="mt-3 flex flex-col gap-4 xl:flex-row justify-between xl:items-center">

                        <Bar barClassName="h-3 w-30" />
                        <div className="grid grid-cols-2 xl:flex gap-3.5">
                            <div className="bg-primary px-4 py-2 xl:w-30 flex items-center justify-center gap-1 cursor-pointer">
                                <Bar barClassName="h-3 w-5" />
                            </div>
                            <div className="px-4 py-2 w-full xl:w-35 border border-border flex items-center justify-center gap-1 cursor-pointer">
                                <Bar barClassName="h-3 w-5" />
                            </div>
                            <div className="bg-card px-4 py-2 xl:w-[91px] border-input border flex items-center justify-center gap-1 cursor-pointer">
                                <Bar barClassName="h-3 w-5" />
                            </div>
                        </div>
                    </div>


                </BaseCard>)
            )}
            {!isLoading && activeProposals.length > 0 && activeProposals.map((proposal: any, index: number) => {
                return (
                    <BaseCard key={index} className="px-3 py-6">
                        <div className="flex gap-2 items-center">
                            <div className="text-sm">
                                {proposal.number}: {proposal.title}
                            </div>
                            <div className="flex flex-col xl:flex-row gap-2">
                                <div className="h-fit rounded-xs border bg-[#80008033] border-purple-500 text-xs px-3">
                                    {proposal.type}
                                </div>
                                <div className={`h-fit rounded-xs border ${proposal.status === 'Rejected' ? 'bg-[#FB2C3633] border-red-500 text-red-500' : 'bg-[#00800033] border-green-500 text-green-500'} text-xs px-3`}>
                                    {proposal.status}
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 w-full xl:w-130 text-xs text-muted-foreground">
                            {proposal.description}
                        </div>
                        <div className="mt-3 flex gap-4 w-max">
                            <div className="flex gap-1 items-center">
                                <FiClock size={12} />
                                <div className="text-xs text-muted-foreground w-max">{proposal.period}</div>
                            </div>
                            <div className="flex gap-1 items-center">
                                <FaCalendarAlt size={12} />
                                <div className="text-xs text-muted-foreground w-max">Created {proposal.createdAt}</div>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col gap-2.5">
                            <div className="flex justify-between">
                                <div className="text-xs text-muted-foreground font-semibold">
                                    Voting Progress
                                </div>
                                <div className="text-xs text-muted-foreground font-medium">
                                    {proposal.now.toLocaleString('en-US')} / {proposal.max.toLocaleString('en-US')} (Quorum)
                                </div>
                            </div>
                            <Progressbar now={proposal.now} min={proposal.min} max={proposal.max} color="bg-primary rounded-full" containerClass="bg-[#bb3eff26] !h-2 !border-none" />
                        </div>
                        <div className="w-full grid grid-cols-2 gap-5 xl:grid-cols-3 justify-between items-start text-start mt-4.5">
                            <div className="flex flex-col gap-2 items-start justify-start w-[150px]">
                                <div className="flex gap-1 items-center">
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                                    <div className="text-sm text-muted-foreground font-semibold">
                                        For ({(proposal.for * 100 / proposal.now).toFixed(1)}%)
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {proposal.for.toLocaleString('en-US')} votes
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 items-start justify-start w-[150px]">
                                <div className="flex gap-1 items-center">
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                                    <div className="text-sm text-muted-foreground font-semibold">
                                        Against ({(proposal.against * 100 / proposal.now).toFixed(1)}%)
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {proposal.against.toLocaleString('en-US')} votes
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 items-start justify-start w-[150px]">
                                <div className="flex gap-1 items-center">
                                    <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full" />
                                    <div className="text-sm text-muted-foreground font-semibold">
                                        Abstain ({(proposal.abstain * 100 / proposal.now).toFixed(1)}%)
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {proposal.abstain.toLocaleString('en-US')} votes
                                </div>
                            </div>
                        </div>
                        <Divider className="mt-3" />
                        {proposal.voted.length === 0 && (
                            <div className="mt-3 flex flex-col gap-4 xl:flex-row justify-between xl:items-center">

                                <div className="text-sm text-muted-foreground">
                                    Your voting power: {proposal.votingPower.toLocaleString('en-US')} AETH
                                </div>
                                <div className="grid grid-cols-2 xl:flex gap-3.5">
                                    <div className="bg-primary px-4 py-2 xl:w-30 flex items-center justify-center gap-1 cursor-pointer">
                                        <FaRegCircleCheck size={16} />
                                        <div className="text-white text-sm font-semibold">Vote</div>
                                    </div>
                                    <div className="px-4 py-2 w-full xl:w-35 border border-border flex items-center justify-center gap-1 cursor-pointer">
                                        <div className="text-white text-sm font-semibold">Vote Against</div>
                                    </div>
                                    <div className="bg-card px-4 py-2 xl:w-[91px] border-input border flex items-center justify-center gap-1 cursor-pointer">
                                        <div className="text-white text-sm font-semibold">Abstain</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {proposal.voted.length > 0 && (
                            <div className="mt-3 py-2 flex gap-4 items-center">
                                <div className="text-sm text-muted-foreground">You voted:</div>
                                <div className="px-3 bg-[#FB9B0033] border border-secondary text-secondary text-xs rounded-xs h-fit">
                                    {proposal.voted}
                                </div>
                            </div>
                        )}
                    </BaseCard>
                )
            })}
            {activeProposals.length === 0 && (
                <div className="h-90 flex flex-col gap-5 mt-5 items-center">
                    <div className="bg-[#FB9B0033] w-10 h-10 rounded-full flex justify-center items-center">
                        <FaRegCircleCheck className="text-secondary" size={20} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="text-base text-foreground font-semibold">No proposals initiated</div>
                        <div className="text-sm text-muted-foreground">Start the discussion by staking AETH and submitting a proposal!</div>
                    </div>
                </div>
            )}
        </BaseCard>
    )
}

export default GovernanceActiveProposals
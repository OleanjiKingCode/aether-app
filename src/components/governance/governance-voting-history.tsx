import BaseCard from "../common/base-card"
import { useEffect, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

const GovernanceVotingHistory = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])
    const tableData = [
        {
            id: 'AIP-005',
            proposal: 'Add Solana Chain Integration',
            category: 'chain',
            status: 'Active',
            myVote: -1, // -1: no vote, 0 : no, 1 : yes
            resultA: '67%',
            resultB: '22%',
            rewards: 0,
            date: '11/15/2024'
        },
        {
            id: 'AIP-004',
            proposal: 'Increase Staking Rewards APY',
            category: 'Protocol',
            status: 'Active',
            myVote: -1, // -1: no vote, 0 : no, 1 : yes
            resultA: '75%',
            resultB: '15%',
            rewards: 0,
            date: '11/12/2024'
        },
        {
            id: 'AIP-003',
            proposal: 'Treasury Diversification Strategy',
            category: 'For',
            status: 'Passed',
            myVote: 1, // -1: no vote, 0 : no, 1 : yes
            resultA: '80%',
            resultB: '22%',
            rewards: 2.1,
            date: '10/28/2024'
        },
        {
            id: 'AIP-002',
            proposal: 'Fee Structure Update',
            category: 'Protocol',
            status: 'Passed',
            myVote: 1, // -1: no vote, 0 : no, 1 : yes
            resultA: '60%',
            resultB: '30%',
            rewards: 1.8,
            date: '10/20/2024'
        },
        {
            id: 'AIP-001',
            proposal: 'Privacy Enhancement',
            category: 'Protocol',
            status: 'Failed',
            myVote: 0, // -1: no vote, 0 : no, 1 : yes
            resultA: '50%',
            resultB: '40%',
            rewards: 1.5,
            date: '10/12/2024'
        },
    ]
    // const tableData: any = []
    return (
        <BaseCard className="p-6 flex flex-col gap-5 w-full">
            <div className="flex gap-2 items-center justify-between h-10">
                <div className="text-sm text-foreground font-semibold">
                    Complete Voting History
                </div>
                <div className="px-4 py-2 bg-background border border-border text-sm text-muted-foreground font-medium">
                    5 Proposals
                </div>
            </div>
            {tableData.length > 0 && (
                <div className="bg-background px-5 py-8 border border-input overflow-x-auto w-full overflow-visible">
                    <table className="text-left w-[1192px]">
                        <thead>
                            <tr className="text-sm text-muted-foreground font-semibold">
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">Proposal</th>
                                <th className="px-3 py-2">Category</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">My Vote</th>
                                <th className="px-3 py-2">Result</th>
                                <th className="px-3 py-2">Rewards</th>
                                <th className="px-3 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody className="overflow-visible">
                            {isLoading ? (
                                <tr>
                                    {[...Array(8)].map((_, i) => (
                                        <td key={i} className="px-3 py-2">
                                            <div className="h-4 w-20 rounded skeleton-bg animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ) : (
                                tableData.map((row: any, idx: number) => (
                                    <tr key={idx} className="text-sm border-input border-t-[1px]">
                                        <td className="px-3 py-2">
                                            {row.id}
                                        </td>
                                        <td className="px-3 py-2">{row.proposal}</td>
                                        <td className="px-3 py-2">
                                            <div className={`w-fit h-fit text-xs rounded-xs px-3 py-1 border ${row.category === 'chain' ? 'bg-[#80008033] text-purple-500 border-purple-500' : (row.category === 'Protocol' ? 'bg-[#00800033] text-green-500 border-green-500' : 'bg-[#FB9B0033] text-secondary border-secondary')}`}>{row.category}</div>
                                        </td>
                                        <td className={`px-3 py-2 ${row.status === 'Passed' ? 'text-green-500' : (row.status === 'Failed' ? 'text-red-500' : 'text-muted-foreground')}`}>
                                            {row.status}
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className={`flex gap-2 items-center justify-center ${row.myVote === -1 ? 'text-foreground' : 'px-1.5 py-1 text-muted-foreground border border-input'}`}>
                                                {row.myVote === -1 ? 'No vote' : (row.myVote === 1 ? 'Yes' : 'No')}
                                            </div>
                                        </td>
                                        <td className={`px-3 py-2 `}>
                                            <span className="text-green-600 text-sm">{row.resultA}</span>
                                            <span className="text-green-600 text-sm"> / </span>
                                            <span className="text-red-600 text-sm">{row.resultB}</span>
                                        </td>
                                        <td className={`px-3 py-2 ${row.rewards === 0 ? 'text-muted-foreground' : 'text-green-600'}`}>
                                            {row.rewards === 0 ? '-' : ('+' + row.rewards + ' AETH')}
                                        </td>
                                        <td className="px-3 py-2 flex items-center">
                                            {row.date}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>)}
            {tableData.length === 0 && (
                <div className="h-90 flex flex-col gap-5 mt-5 items-center">
                    <div className="bg-[#FB9B0033] w-10 h-10 rounded-full flex justify-center items-center">
                        <FaRegCircleCheck className="text-secondary" size={20} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="text-base text-foreground font-semibold">No Votes Yet</div>
                        <div className="text-sm text-muted-foreground">Cast your first vote to participate in governance!</div>
                    </div>
                </div>
            )}
        </BaseCard>
    )
}

export default GovernanceVotingHistory
import { useState } from "react";
import { MdAccessAlarm } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";


const StakingLockPeriod = () => {

    const [selectedPeriod, setSelectedPeriod] = useState(-1);
    const stakePeriodData = [
        {
            period: 'Flexible',
            date: '7days',
            time: '10min',
            apy: '8.5%',
            withdrawTime: '3days',
            minAmount: '500',
            color: '#00B8DB',
        },
        {
            period: '1 Month',
            date: '30days',
            time: '100min',
            apy: '10.5%',
            withdrawTime: '3days',
            minAmount: '500',
            color: '#F6339A',
        },
        {
            period: '3 Months',
            date: '90days',
            time: '500min',
            apy: '12.8%',
            withdrawTime: '3days',
            minAmount: '500',
            color: '#FB9B00',
        },
        {
            period: '6 Months',
            date: '180days',
            time: '1000min',
            apy: '15.5%',
            withdrawTime: '3days',
            minAmount: '500',
            color: '#BB3EFF',
        }
    ]
    return (
        <div className="w-full">
            <div className="flex gap-1.5 items-center">
                <MdAccessAlarm size={20} className="text-secondary" />
                <div className="text-sm text-foreground font-semibold">Chose lock period</div>
                <MdInfoOutline size={10} className="text-secondary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2.5">
                {stakePeriodData.map((row, index) => {
                    return (
                        <div className={`border border-input px-4 py-2 flex justify-between items-center cursor-pointer ${index === selectedPeriod ? 'bg-[#BB3EFF33] border-primary' : ''}`} onClick={() => setSelectedPeriod(index)}>
                            <div className="flex flex-col gap-1 ">
                                <div className="text-xs text-foreground font-semibold">
                                    {row.period}
                                </div>
                                <div className="flex gap-1">
                                    <div className="text-xs text-muted-foreground">
                                        {row.date}
                                    </div>
                                    <div className="w-0.5 h-0.5 rounded-full bg-foreground" />
                                    <div className="text-xs text-muted-foreground">
                                        {row.time}
                                    </div>
                                </div>
                            </div>
                            <div className={`text-sm text-[${row.color}] font-medium`}>
                                {row.apy} APY
                            </div>
                        </div>
                    )
                })}
            </div>
            {selectedPeriod !== -1 && (
                <div className="mt-5 py-6 px-4 flex flex-col gap-3.5 border border-input">
                    <div className="flex justify-between">
                        <div className={`text-sm  text-[${stakePeriodData[selectedPeriod].color}] font-semibold`}>
                            {stakePeriodData[selectedPeriod].date} Pool Selected
                        </div>
                        <div className={`px-3 text-xs border border-[${stakePeriodData[selectedPeriod].color}] text-[${stakePeriodData[selectedPeriod].color}] bg-[${stakePeriodData[selectedPeriod].color}33]`}>
                            {stakePeriodData[selectedPeriod].apy} APY
                        </div>
                    </div>
                    <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col gap-1 w-50">
                            <div className="text-xs font-medium text-foreground">Lock Period:</div>
                            <div className="text-xs text-muted-foreground">{stakePeriodData[selectedPeriod].period}</div>
                        </div>
                        <div className="flex flex-col gap-1 w-50">
                            <div className="text-xs font-medium text-foreground">Withdraw Time:</div>
                            <div className="text-xs text-muted-foreground">{stakePeriodData[selectedPeriod].withdrawTime}</div>
                        </div>
                        <div className="flex flex-col gap-1 w-50">
                            <div className="text-xs font-medium text-foreground">Min Amount:</div>
                            <div className="text-xs text-muted-foreground">{stakePeriodData[selectedPeriod].minAmount}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StakingLockPeriod
import Image from "next/image";
import ChartIcon from "public/icon/Chart-Icon.svg"
import { useEffect, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
    AreaChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import Alert from "./alert";
import Bar from "../common/skeleton/bar";

const mockData: any = {
    '24H': [
        { time: '2hrs', price: 1 },
        { time: '4hrs', price: 50 },
        { time: '6hrs', price: 20 },
        { time: '8hrs', price: 30 },
        { time: '10hrs', price: 70 },
    ],
};

const Chart = () => {
    const [range, setRange] = useState('24H');

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }, [])
    return (
        <div className="p-6 border-input bg-card border-[1px] w-full">
            <div className="flex items-center gap-1.5">
                <div className="">
                    <Image src={ChartIcon} alt="" height={15} width={15} />
                </div>
                <div className="font-geist-mono font-semibold text-base text-foreground">
                    Protocol Overview
                </div>
                <IoMdInformationCircleOutline size={12} className="text-secondary" />
            </div>
            <div className="h-[194px] mt-5">
                {isLoading === true && (<Bar barClassName="w-full h-36" />)}
                {!isLoading && (<ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                        width={500}
                        height={200}
                        data={mockData[range]}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="5 5" stroke="#3F2A63" />
                        <XAxis dataKey="time" />
                        <Tooltip contentStyle={{ background: '#06081E' }} />
                        <Area type="monotone" dataKey="price" stroke="url(#paint0_linear_843_9330)" fill="url(#paint0_linear_843_9330)" fillOpacity={0.2} />
                        <defs>
                            <linearGradient id="paint0_linear_843_9330" x1="106.851" y1="84.8181" x2="325.101" y2="-243.593" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#5C14AF" />
                                <stop offset="1" stop-color="#FB9B00" stop-opacity="0.76" />
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ResponsiveContainer>)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <Alert isLoading={isLoading} status={1} name="Trading Volume" value="$2.4M" rate="+12.5%" />
                <Alert isLoading={isLoading} status={2} name="Total Liquidity" value="$18.7M" rate="+0.2%" />
                <Alert isLoading={isLoading} status={1} name="Active Users" value="12,847" rate="15.3%" />
                <Alert isLoading={isLoading} status={1} name="Total Transactions" value="1.2m" rate="+22.1%" />
            </div>
        </div>
    )
}

export default Chart;
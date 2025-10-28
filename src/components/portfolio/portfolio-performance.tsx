import Image from "next/image";
import ChartIcon from "public/icon/Chart-Icon.svg"
import { useEffect, useState } from "react";
import { IoTrendingUp } from "react-icons/io5";

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
import Bar from "../common/skeleton/bar";
import useDeviceWidth from "@/hooks/device-width";

const mockData: any = {
    '24H': [
        { time: '2hrs', price: 1, label: "1k" },
        { time: '4hrs', price: 5000, label: "5k" },
        { time: '6hrs', price: 2000, label: "2k" },
        { time: '8hrs', price: 3000, label: "3k" },
        { time: '10hrs', price: 7000, label: "7k" },
    ],
};

const PortfolioPerformance = () => {
    const [range, setRange] = useState('24H');
    const width = useDeviceWidth();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 3000)
    }, [])
    return (
        <div className="p-6 border-input bg-card border-[1px] w-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                    <div className="gradient-bg p-2">
                        <IoTrendingUp />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="font-geist-mono font-semibold text-sm sm:text-base text-foreground">
                            Portfolio Performance
                        </div>
                        <div className="text-xs text-muted-foreground">$16,965</div>
                    </div>
                </div>
                <div className="bg-[#00C95133] border border-green-600 text-xs  text-green-600 px-1 h-fit">
                    +8.3% (+$712.50)
                </div>
            </div>
            <div className="h-fit mt-5">
                {isLoading === true && (<Bar barClassName="w-full h-36" />)}
                {!isLoading && (<ResponsiveContainer width="100%" height={width > 500 ? 270 : 106}>
                    <AreaChart
                        width={ width > 500 ? 500 : (width - 80)}
                        height={width > 500 ? 200 : 106}
                        data={mockData[range]}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        {/* <CartesianGrid strokeDasharray="5 5" stroke="#3F2A63" /> */}
                        <XAxis dataKey="time" />
                        <YAxis dataKey="price" />
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

        </div>
    )
}

export default PortfolioPerformance;
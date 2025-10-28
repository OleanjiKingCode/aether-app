import Modal from "react-modal";
import { RiCloseLargeLine } from "react-icons/ri";
import { IoMdTrendingUp } from "react-icons/io";
import { RxExternalLink } from "react-icons/rx";
import { LuBell } from "react-icons/lu";
import useDeviceWidth from "@/hooks/device-width";
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

interface TokenDetailModalProps {
    isOpen: boolean;
    setIsOpen: Function;
}

const TokenDetailModal = ({ isOpen, setIsOpen }: TokenDetailModalProps) => {
    const width = useDeviceWidth();
    const customModalStyles = {
        content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "auto",
            width: width > 800 ? "612px" : "100%",
            height: width > 800 ? "fit-content" : '90vh',
            border: "1px solid #3F2A63",
            background: "#010314",
            padding: "0",
        },
        overlay: {
            zIndex: 99999,
            background: "#00000080",
        },
    };

    const TokenData = {
        name: 'Aether Token',
        symbol: 'AETH',
        network: 'Ethereum',
        price: 2,
        status: 'up',
        rate: 12.4,
        holdingAmount: 1250,
        value: 2500,
        marketcap: 2400.5,
        volume_24: "2.1M",
        allTimeHigh: 4.20,
        allTimeLow: 0.15,
        circulatingSupply: '250M',
        totalSupply: '1B',
        portfolioAllocation: '52.8%',
        website: '',
        about: 'AetherDEX Token is the native governance token for the AetherDEX decentralized exchange, enabling users to participate in protocol governance and earn staking rewards.'
    }

    const mockData: any = [
        { time: '2hrs', price: 1, label: "1k" },
        { time: '4hrs', price: 5000, label: "5k" },
        { time: '6hrs', price: 2000, label: "2k" },
        { time: '8hrs', price: 3000, label: "3k" },
        { time: '10hrs', price: 7000, label: "7k" },
    ];
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => { setIsOpen(false), document.body.classList.remove('modal-open'); }}
            style={customModalStyles}
        >
            <div className="w-full relative border-b border-input p-4 md:p-6">
                <div className="flex gap-3">
                    <div className="bg-primary rounded-full min-w-5 h-5 text-foreground text-[10px] flex justify-center items-center">
                        {TokenData.symbol.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-foreground text-sm font-semibold">{TokenData.name} ({TokenData.symbol})</div>
                        <div className="border border-input px-1.5 py-1 text-xs font-normal text-muted-foreground w-fit">
                            {TokenData.network}
                        </div>
                        <div className="text-xs text-muted-foreground">View detailed information about your AetherDEX Token holdings including price data, market statistics, and portfolio allocation.</div>
                    </div>
                </div>
                <div className="absolute top-6 right-6 cursor-pointer" onClick={() => setIsOpen(false)}>
                    <RiCloseLargeLine size={24} />
                </div>
            </div>
            <div className="w-full p-4 md:p-6  flex gap-6 flex-col">
                <div className="flex gap-6 w-full flex-col md:flex-row">
                    <div className="border border-input px-6 py-3.5 flex flex-col gap-1 w-full">
                        <div className="text-base text-muted-foreground font-medium">
                            Current Price
                        </div>
                        <div className="text-xl text-foreground font-semibold">${TokenData.price.toLocaleString('en-US')}</div>
                        <div className="flex gap-1">
                            <IoMdTrendingUp size={20} />
                            <div className={`${TokenData.status === 'up' ? 'text-green-600' : 'text-red-600'} text-sm`}>
                                {TokenData.status === 'up' ? '+' : '-'} {TokenData.rate}
                            </div>
                        </div>
                    </div>
                    <div className="border border-input px-6 py-3.5 flex flex-col gap-1 w-full">
                        <div className="text-base text-muted-foreground font-medium">
                            Your Holdings
                        </div>
                        <div className="text-xl text-foreground font-semibold">${TokenData.holdingAmount.toLocaleString('en-US')} {TokenData.symbol}</div>
                        <div className="flex gap-1 text-muted-foreground text-sm">
                            <div>
                                Value:
                            </div>
                            <div>
                                ${TokenData.value.toLocaleString('en-US')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-6 w-full text-xs text-muted-foreground  flex-col md:flex-row">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex justify-between">
                            <div>Market Cap</div>
                            <div>${TokenData.marketcap.toLocaleString('en-US')}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>24h Volume</div>
                            <div>${TokenData.volume_24}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>All Time High</div>
                            <div>${TokenData.allTimeHigh.toLocaleString('en-US')}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>All Time Low</div>
                            <div>${TokenData.allTimeLow.toLocaleString('en-US')}</div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex justify-between">
                            <div>Circulating Supply</div>
                            <div>{TokenData.circulatingSupply} {TokenData.symbol}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Total Supply</div>
                            <div>{TokenData.totalSupply} {TokenData.symbol}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Portfolio Allocation</div>
                            <div>{TokenData.portfolioAllocation}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Website</div>
                            <div className="flex gap-1 items-center">
                                <div>Visit</div>
                                <RxExternalLink size={16} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border border-input bg-card p-[25px]">
                    <div className="text-lg text-white font-semibold">24h Price History</div>
                    <ResponsiveContainer width="100%" height={150}>
                        <AreaChart
                            width={width > 800 ? 540 : (width - 40)}
                            height={131}
                            data={mockData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <XAxis dataKey="time" />
                            <Tooltip contentStyle={{ background: '#06081E' }} />
                            <Area type="monotone" dataKey="price" stroke="#FB9B00" fill="url(#paint0_linear_843_9330)" fillOpacity={0.2} />
                            <defs>
                                <linearGradient id="paint0_linear_843_9330" x1="36.3071" y1="98.25" x2="129.633" y2="-124.681" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#5C14AF" />
                                    <stop offset="1" stop-color="#FB9B00" stop-opacity="0.76" />
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-sm text-foreground font-semibold">
                        About {TokenData.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {TokenData.about}
                    </div>
                </div>
                <div className="w-full flex items-end justify-between md:justify-end gap-3.5">
                    <div className="border border-secondary flex px-4 py-2 gap-1.5 justify-center text-muted-foreground text-sm font-medium w-full md:w-fit">
                        <RxExternalLink size={20} />
                        Trade AETH
                    </div>
                    <div className="bg-primary flex px-4 py-2 gap-1.5 justify-center text-muted-foreground text-sm font-medium w-full md:w-fit">
                        <LuBell size={20} />
                        Set Price Alert
                    </div>
                </div>
            </div>
        </Modal >
    )
}

export default TokenDetailModal
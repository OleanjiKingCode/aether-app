import { useEffect, useState } from "react"
import TokenSelect from "../common/token-select"
import NetworkSelect from "../common/network-select"
import Bar from "../common/skeleton/bar"
import { ChainType, getChains, getTokens, getTokenBalance, getToken } from '@lifi/sdk';
import { useAccount } from "wagmi";
import { BigNumberish } from "ethers";

interface TokenPanelProps {
    title: string,
    isLoading?: boolean,
    setToken: (token: any) => void,
    token?: any,
    setChain: (chain: any) => void,
    chain?: any,
    setAmount: (amount: number) => void,
    amount: number | BigNumberish
}

const TokenPanel = ({ title, setToken, token, setChain, chain, setAmount, amount }: TokenPanelProps) => {

    const [balance, setBalance] = useState<any>(0)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedToken, setSelectedToken] = useState<any>()
    const [selectedNetwork, setSelectedNetwork] = useState<any>()
    const [networkData, setNetworkData] = useState<any[]>([])
    const [allTokens, setAllTokens] = useState<any>({}) // Store all tokens by chain ID
    const [tokenData, setTokenData] = useState<any[]>([]) // Filtered tokens for current chain
    const { address, chainId } = useAccount()

    const handleTokenChange = (value: string) => {
        const token = tokenData.find((t) => t.name === value)
        setSelectedToken(token || undefined)
        setToken(token || undefined)
    }

    const handleNetworkChange = (value: string) => {
        const network = networkData.find((n) => n.name === value)
        setSelectedNetwork(network || undefined)
        setChain(network || undefined)
        
        // Update token list based on selected network
        if (network && network.id && allTokens[network.id]) {
            setTokenData([...allTokens[network.id]])
            // Set first token as default when network changes
            const firstToken = allTokens[network.id][0]
            setSelectedToken(firstToken)
            setToken(firstToken)
        } else if (network && network.id) {
            // If no tokens available for this chain, clear the list
            setTokenData([])
            setSelectedToken(undefined)
            setToken(undefined)
        }
    }

    const init = async () => {
        try {
            setIsLoading(true)
            const chains = await getChains({ chainTypes: [ChainType.EVM] });
            const tokens = await getTokens({
                chainTypes: [ChainType.EVM, ChainType.SVM],
            });
            
            console.log('tokens => ', tokens);
            
            // Store all tokens by chain ID
            setAllTokens(tokens['tokens'] || {});
            setNetworkData(chains);
            
            // Set default network (first chain)
            const defaultChain = chains[0];
            setSelectedNetwork(defaultChain);
            
            // Set tokens for the default chain
            const defaultChainId = defaultChain?.id;
            if (defaultChainId && tokens['tokens'][defaultChainId]) {
                const chainTokens = tokens['tokens'][defaultChainId];
                setTokenData([...chainTokens]);
                const firstToken = chainTokens[0];
                setSelectedToken(firstToken);

                if (firstToken && setToken) {
                    setToken(firstToken);
                }
                if (defaultChain && setChain) {
                    setChain(defaultChain);
                }

                // Fetch balance for the first token
                if (address && firstToken) {
                    try {
                        const token = await getToken(defaultChainId, firstToken.address);
                        console.log('token => ', token);
                        
                        if (token) {
                            try {
                                const selectedTokenBalance = await getTokenBalance(address.toString(), token);
                                console.log('balance => ', selectedTokenBalance);
                                setBalance(selectedTokenBalance ? selectedTokenBalance : 0);
                            } catch (err) {
                                console.error('Error fetching token balance:', err);
                            }
                        }
                    } catch (err) {
                        console.error('Error fetching token:', err);
                    }
                }
            }

            setIsLoading(false)

        } catch (error) {
            console.error('getting chain list error => ', error);
            setIsLoading(false)
        }
    }

    useEffect(() => {
        init()
    }, [])

    // Update balance when token or network changes
    useEffect(() => {
        const fetchBalance = async () => {
            if (address && selectedToken && selectedNetwork?.id) {
                try {
                    const token = await getToken(selectedNetwork.id, selectedToken.address);
                    if (token) {
                        const selectedTokenBalance = await getTokenBalance(address.toString(), token);
                        setBalance(selectedTokenBalance ? selectedTokenBalance : 0);
                    }
                } catch (err) {
                    console.error('Error fetching token balance:', err);
                    setBalance(0);
                }
            }
        }
        fetchBalance();
    }, [selectedToken, selectedNetwork, address])

    return (
        <div className="bg-background border-[1px] border-input py-6 px-3 flex flex-col gap-2.5">
            <div className="flex justify-between">
                <div className="text-muted-foreground text-sm">{title}</div>
                <div className="flex gap-2.5 items-center">
                    <div className="text-muted-foreground text-sm ">Balance:</div>
                    {isLoading && <Bar barClassName="w-10 h-3" />}
                    {!isLoading && (<div className="text-muted-foreground text-sm ">{balance}</div>)}
                </div>
            </div>
            <div className="flex justify-between gap-5 flex-col md:flex-row md:items-center ">
                <div className="w-full">
                    {isLoading && <Bar barClassName="w-full md:w-100 h-3" />}
                    {!isLoading && (<TokenSelect data={tokenData} value={selectedToken} onChange={handleTokenChange} />)}
                </div>
                <div>On</div>
                <div className="">
                    {isLoading && <Bar barClassName="w-full md:w-100 h-3" />}
                    {!isLoading && (<NetworkSelect data={networkData} value={selectedNetwork} onChange={handleNetworkChange} />)}
                </div>
            </div>
            <div className="text-foreground text-xl w-full">
                {isLoading && <Bar barClassName="w-full h-3" />}

                {!isLoading && (<input className="w-full outline-0" placeholder="Input amount" value={amount.toString()} onChange={(e: any) => setAmount(e.target.value)} />)}
            </div>
            <div className="flex justify-between">
                {isLoading && <Bar barClassName="md:w-25 h-3" />}
                {!isLoading && selectedToken && (<div className="text-muted-foreground text-sm">≈ ${selectedToken.priceUSD * (Number(amount) === 0 ? 1 : Number(amount))}</div>)}

                {isLoading && <Bar barClassName="md:w-25 h-3" />}
                {!isLoading && (<div className="text-lg text-primary ">Max</div>)}
            </div>
        </div>
    )
}

export default TokenPanel
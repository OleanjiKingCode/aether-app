import { useEffect, useState } from "react"
import axios from "axios"
import { getRoutes as getRoutesFromLiFi, RoutesRequest } from '@lifi/sdk';
import { BigNumberish } from "ethers";

export const getQuote = (fromChain: any, toChain: any, fromToken: any, toToken: any, fromAmount: any, fromAddress: any) => {
    const [quote, setQuote] = useState<any>(null)
    const getQuote = async (fromChain: any, toChain: any, fromToken: any, toToken: any, fromAmount: any, fromAddress: any) => {
        console.log('start get quote')
        // The LiFi API expects string values for token and chain params, not objects.
        // Cast chain and token objects to their proper string values.
        const result = await axios.get('https://li.quest/v1/quote', {
            params: {
                fromChain: typeof fromChain === 'object' && fromChain.chainId ? String(fromChain.chainId) : String(fromChain),
                toChain: typeof toChain === 'object' && toChain.chainId ? String(toChain.chainId) : String(toChain),
                fromToken: typeof fromToken === 'object' && fromToken.address ? fromToken.address : String(fromToken),
                toToken: typeof toToken === 'object' && toToken.address ? toToken.address : String(toToken),
                fromAmount: typeof fromAmount === 'object' ? String(fromAmount) : String(fromAmount),
                fromAddress: typeof fromAddress === 'object' ? String(fromAddress) : String(fromAddress),
            }
        });
        console.log('result => ', result.data);
        return result.data;
    }

    const process = async () => {
        if (fromChain && toChain && fromToken && toToken && fromAmount && fromAddress) {
            const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress)
            setQuote(quote)
        }
    }

    useEffect(() => {
        process()
    }, [fromChain, toChain, fromToken, toToken, fromAmount, fromAddress])

    return { quote }
}


export const getRoutes = (fromchain: number, tochain: number, fromaddress: string, toaddress: string, fromamount: number | BigNumberish) => {
    const [routes, setRoutes] = useState<any>(null)
    const getRoutesFromSDK = async (fromchain: number, tochain: number, fromaddress: string, toaddress: string, fromamount: number | BigNumberish) => {
        if (fromchain && tochain && fromaddress && toaddress && fromamount) {
            const routesRequest: RoutesRequest = {
                fromChainId: fromchain,
                toChainId: tochain,
                fromTokenAddress: fromaddress,
                toTokenAddress: toaddress,
                fromAmount: fromamount.toString(),
            };
            try {
                const result = await getRoutesFromLiFi(routesRequest);
                setRoutes(result.routes)
            } catch (error) {
                console.log('error => ', error)
            }
        }
    }

    useEffect(() => {
        if (fromchain && tochain && fromaddress && toaddress && fromamount) {
            getRoutesFromSDK(fromchain, tochain, fromaddress, toaddress, fromamount)
        }
    }, [fromchain, tochain, fromaddress, toaddress, fromamount])

    return { routes }
}
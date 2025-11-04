import { useEffect, useState } from "react";
import axios from "axios";
import { getRoutes as getRoutesFromLiFi, RoutesRequest } from "@lifi/sdk";
import { BigNumberish } from "ethers";

export const useGetQuote = (
  fromChain: unknown,
  toChain: unknown,
  fromToken: unknown,
  toToken: unknown,
  fromAmount: unknown,
  fromAddress: unknown
) => {
  const [quote, setQuote] = useState<unknown>(null);
  const fetchQuote = async (
    fromChain: unknown,
    toChain: unknown,
    fromToken: unknown,
    toToken: unknown,
    fromAmount: unknown,
    fromAddress: unknown
  ) => {
    console.log("start get quote");
    // The LiFi API expects string values for token and chain params, not objects.
    // Cast chain and token objects to their proper string values.
    const result = await axios.get("https://li.quest/v1/quote", {
      params: {
        fromChain:
          typeof fromChain === "object" &&
          fromChain !== null &&
          "chainId" in fromChain
            ? String(fromChain.chainId)
            : String(fromChain),
        toChain:
          typeof toChain === "object" &&
          toChain !== null &&
          "chainId" in toChain
            ? String(toChain.chainId)
            : String(toChain),
        fromToken:
          typeof fromToken === "object" &&
          fromToken !== null &&
          "address" in fromToken
            ? fromToken.address
            : String(fromToken),
        toToken:
          typeof toToken === "object" &&
          toToken !== null &&
          "address" in toToken
            ? toToken.address
            : String(toToken),
        fromAmount:
          typeof fromAmount === "object"
            ? String(fromAmount)
            : String(fromAmount),
        fromAddress:
          typeof fromAddress === "object"
            ? String(fromAddress)
            : String(fromAddress),
        integrator: "aetherDex",
        fee: 0.02, // 2% fee
      },
      headers: {
        "x-lifi-api-key":
          "3b6d01c6-9d28-4de0-9df9-8bcabecb4be3.4fa6781c-0d9f-4dce-8793-6a953f224edc",
      },
    });
    console.log("result => ", result.data);
    return result.data;
  };

  const process = async () => {
    if (
      fromChain &&
      toChain &&
      fromToken &&
      toToken &&
      fromAmount &&
      fromAddress
    ) {
      const quoteData = await fetchQuote(
        fromChain,
        toChain,
        fromToken,
        toToken,
        fromAmount,
        fromAddress
      );
      setQuote(quoteData);
    }
  };

  useEffect(() => {
    process();
  }, [fromChain, toChain, fromToken, toToken, fromAmount, fromAddress]);

  return { quote };
};

export const useGetRoutes = (
  fromchain: number,
  tochain: number,
  fromaddress: string,
  toaddress: string,
  fromamount: number | BigNumberish
) => {
  const [routes, setRoutes] = useState<unknown>(null);
  const getRoutesFromSDK = async (
    fromchain: number,
    tochain: number,
    fromaddress: string,
    toaddress: string,
    fromamount: number | BigNumberish
  ) => {
    if (fromchain && tochain && fromaddress && toaddress && fromamount) {
      const routesRequest: RoutesRequest = {
        fromChainId: fromchain,
        toChainId: tochain,
        fromTokenAddress: fromaddress,
        toTokenAddress: toaddress,
        fromAmount: fromamount.toString(),
        options: {
          integrator: "aetherDex",
          fee: 0.02, // 2% fee
        },
      };
      try {
        const result = await getRoutesFromLiFi(routesRequest);
        setRoutes(result.routes);
      } catch (error) {
        console.log("error => ", error);
      }
    }
  };

  useEffect(() => {
    if (fromchain && tochain && fromaddress && toaddress && fromamount) {
      getRoutesFromSDK(fromchain, tochain, fromaddress, toaddress, fromamount);
    }
  }, [fromchain, tochain, fromaddress, toaddress, fromamount]);

  return { routes };
};

import DetailAccordion from "./detail-accordion";
import PrivacyMode from "./privacy-mode";
import SwapAIRoute from "./swap-ai-route";
import SwitchButton from "../common/switch-button";
import TokenPanel from "./token-panel";
import { IoSwapVertical } from "react-icons/io5";
import SettingIcon from "public/icon/settings.svg";
import { Progressbar } from "../common/progresbar";
import SwapTransactionDetail from "./swap-transaction-detail";
import { useEffect, useState } from "react";
import Bar from "../common/skeleton/bar";
import { useGetQuote, useGetRoutes } from "@/hooks/lifi-sdk";
import { useAccount } from "wagmi";
import { parseEther, formatEther, BigNumberish } from "ethers";

interface SwapProps {
  isLoading?: boolean;
}

const Swap = ({ isLoading }: SwapProps) => {
  const [isPrivacy, setIsPrivacy] = useState(false);
  const [mode, setMode] = useState(1); // 1 : market. 2 : limit
  const [limitValue, setLimitValue] = useState();
  const [fromToken, setFromToken] = useState<any>();
  const [fromChain, setFromChain] = useState<any>();
  const [fromAmount, setFromAmount] = useState<number | BigNumberish>(0);
  const { address } = useAccount();

  const [toToken, setToToken] = useState<any>();
  const [toChain, setToChain] = useState<any>();
  const [toAmount, setToAmount] = useState<any>(0);

  // const { quote } = useGetQuote(fromChain, toChain, fromToken, toToken, fromAmount, address)
  const { routes } = useGetRoutes(
    fromChain,
    toChain,
    fromToken && fromToken.address ? fromToken.address : "",
    toToken && toToken.address ? toToken.address : "",
    fromAmount !== undefined && fromAmount !== null
      ? fromAmount.toString()
      : "0"
  );
  console.log("routes => ", routes);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      console.log("fromToken => ", fromToken);
      console.log("toToken => ", toToken);
      console.log("fromAmount => ", fromAmount);
      console.log("toAmount => ", toAmount);
    }
  }, [fromToken, toToken, fromAmount]);

  return (
    <div className="bg-card border-[1px] border-input p-6 flex flex-col gap-5">
      <SwitchButton
        isLoading={isLoading}
        value={mode}
        setValue={setMode}
        firstOptionName="Market"
        secondOptionName="Limit"
      />
      <div className="relative">
        <TokenPanel
          title="From"
          isLoading={isLoading}
          setToken={setFromToken}
          token={fromToken}
          chain={fromChain}
          setChain={setFromChain}
          setAmount={setFromAmount}
          amount={fromAmount}
        />
        {mode === 2 && (
          <div className="flex flex-col gap-2.5 mt-2.5">
            <div className="text-sm text-muted-foreground font-medium">
              Limit price
            </div>
            <input
              type="number"
              className="bg-background border border-input px-3 py-2.5 w-full text-sm outline-none"
              placeholder="Price in RNDR"
              value={limitValue}
              onChange={(e: any) => setLimitValue(e.target.value)}
            />
          </div>
        )}
        <div
          className={`absolute ${
            mode === 1 ? "bottom-[-40.5px]" : "bottom-[-70.5px]"
          } left-[calc(50%-22.5px)] bg-card border-[1px] border-input rounded-full p-2 flex justify-center items-center w-15 h-15`}
        >
          <div className="w-[45px] h-[45px] flex items-center justify-center bg-background rounded-full">
            <IoSwapVertical size={20} />
          </div>
        </div>
      </div>
      <div className={`${mode === 1 ? "" : "mt-16"}`}>
        <TokenPanel
          title="To"
          isLoading={isLoading}
          setToken={setToToken}
          token={toToken}
          chain={toChain}
          setChain={setToChain}
          setAmount={setToAmount}
          amount={toAmount}
        />
      </div>
      <PrivacyMode
        isPrivacy={isPrivacy}
        setIsPrivacy={setIsPrivacy}
        isLoading={isLoading}
      />
      {isPrivacy && <SwapAIRoute />}
      {isPrivacy && (
        <DetailAccordion
          icon={SettingIcon}
          title="Advanced Settings"
          className="!border-none pl-0 op"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-xs text-foreground">
                Slippage Tolerance: 0.5%
              </div>
              <Progressbar
                now={70}
                min={0}
                max={100}
                color="bg-primary rounded-full"
                containerClass="bg-[#bb3eff26] !h-2 !border-none"
              />
            </div>
            <div className="flex gap-2">
              <div className="cursor-pointer w-10 h-7 border border-input bg-background flex items-center justify-center text-xs text-muted-foreground">
                0.1%
              </div>
              <div className="cursor-pointer w-10 h-7 border border-input bg-background flex items-center justify-center text-xs text-muted-foreground">
                0.5%
              </div>
              <div className="cursor-pointer w-10 h-7 border border-input bg-background flex items-center justify-center text-xs text-muted-foreground">
                1%
              </div>
            </div>
          </div>
        </DetailAccordion>
      )}
      {isPrivacy && <SwapTransactionDetail />}
      <button className="w-full h-10 gradient-bg text-xs text-foreground cursor-pointer">
        {isLoading && <Bar barClassName="w-8 h-3 mx-auto" />}
        {!isLoading && "Swap"}
      </button>
    </div>
  );
};

export default Swap;

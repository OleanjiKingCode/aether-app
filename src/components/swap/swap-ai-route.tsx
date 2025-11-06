import SwapPrivacyIcon from "public/icon/swap/swap-ai-route-icon.svg";
import BaseCard from "../common/base-card";
import Image from "next/image";
import { useState } from "react";

const SwapAIRoute = () => {
  const [isShow, setIsShow] = useState(false);

  const showDetail = () => {
    setIsShow(!isShow);
  };
  const aiRoutes = [
    {
      name: "Cross-Chain Bridge",
      sucessfulRate: "96% confidence",
      isRecommended: true,
      fee: "0.16",
      routes: "ETH → Wormhole Bridge → RENDER",
      time: "18s",
      save: "Save $8.35",
      details: "15 pools • 0.000% impact",
    },
    {
      name: "AI Optimized (Solana Hub)",
      sucessfulRate: "90% confidence",
      isRecommended: false,
      fee: "8.51",
      routes: "ETH → SOL → RENDER",
      time: "45s",
      save: "",
      details: "6 pools • 0.000% impact",
    },
    {
      name: "Stargate",
      sucessfulRate: "90% confidence",
      isRecommended: false,
      fee: "5.51",
      routes: "ETH → Stargate → RENDER",
      time: "28s",
      save: "",
      details: "6 pools • 0.000% impact",
    },
  ];

  return (
    <div className="">
      <BaseCard className={`pb-3.5 flex flex-col gap-2.5 !bg-background`}>
        <div className="flex justify-between gap-2.5">
          <div className="flex justify-between w-full flex-col md:flex-row gap-6 mb-6 md:mb-0">
            <div className="flex gap-1.5 items-center">
              <div className="">
                <Image
                  src={SwapPrivacyIcon.src}
                  width={20}
                  height={20}
                  alt=""
                />
              </div>
              <div className="text-base text-foreground">AI Route Analysis</div>
            </div>
            <BaseCard className="text-xs text-muted-foreground !font-normal !px-1.5 !py-1 w-fit">
              3 Options found
            </BaseCard>
          </div>
          <div className="flex">
            <div
              className={`flex items-center cursor-pointer justify-center transition-transform duration-300 origin-center text-primary text-sm`}
              onClick={showDetail}
            >
              {isShow ? "Hide" : "Details"}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-xs text-muted-foreground">
            Analyzed 3 routes across 8 DEXs and 4 bridges:
          </div>
        </div>
        <div>
          <BaseCard
            className={`bg-transparent px-3 py-2.5 ${
              aiRoutes[0].isRecommended ? "!border-primary !bg-[#BB3EFF33]" : ""
            }`}
          >
            <div className="flex justify-between gap-3">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="text-sm text-muted-foreground">
                    {aiRoutes[0].name}
                  </div>
                  <BaseCard className="bg-background text-xs px-3 py-[1px]  w-fit">
                    {aiRoutes[0].sucessfulRate}
                  </BaseCard>
                  {aiRoutes[0].isRecommended && (
                    <BaseCard className="!bg-[#00C95133] !border-green-600 text-xs px-3 py-[1px]  w-fit">
                      Recommended
                    </BaseCard>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {aiRoutes[0].routes}
                </div>
                <div className="text-xs text-border">{aiRoutes[0].details}</div>
              </div>
              <div className="flex flex-col gap-2 justify-end text-end">
                <div className="text-sm text-muted-foreground">
                  ${aiRoutes[0].fee}
                </div>
                <div className="text-xs text-muted-foreground">
                  {aiRoutes[0].time}
                </div>
                <div className="text-xs text-green-600">{aiRoutes[0].save}</div>
              </div>
            </div>
          </BaseCard>
        </div>
        {isShow && (
          <div
            className={`transition-all duration-300 ${
              isShow ? "opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2.5 mb-2.5">
              <div className="flex flex-col gap-3">
                {aiRoutes.map((row, index) => {
                  return (
                    <BaseCard
                      key={index}
                      className={`bg-transparent px-3 py-2.5 ${
                        row.isRecommended ? "hidden" : ""
                      }`}
                    >
                      <div className="flex justify-between gap-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col md:flex-row gap-2">
                            <div className="text-sm text-muted-foreground">
                              {row.name}
                            </div>
                            <BaseCard className="bg-background w-fit text-xs px-3 py-[1px] ">
                              {row.sucessfulRate}
                            </BaseCard>
                            {row.isRecommended && (
                              <BaseCard className="!bg-[#00C95133] !border-green-600 text-xs px-3 py-[1px] ">
                                {row.sucessfulRate}
                              </BaseCard>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {row.routes}
                          </div>
                          <div className="text-xs text-border">
                            {row.details}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-end text-end">
                          <div className="text-sm text-muted-foreground">
                            ${row.fee}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {row.time}
                          </div>
                          <div className="text-xs text-green-600">
                            {row.save}
                          </div>
                        </div>
                      </div>
                    </BaseCard>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </BaseCard>
    </div>
  );
};

export default SwapAIRoute;

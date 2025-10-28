"use client";

import { useState, useRef, useCallback } from "react";
import { LiFiWidget } from "@lifi/widget";
import type { WidgetConfig, WidgetDrawer } from "@lifi/widget";
import { lifiService } from "../../services/lifi.service";
import SwitchButton from "../common/switch-button";
import TokenPanel from "./token-panel";
import PrivacyMode from "./privacy-mode";
import DetailAccordion from "./detail-accordion";
import SwapTransactionDetail from "./swap-transaction-detail";
import SwapAIRoute from "./swap-ai-route";
import { IoSwapVertical } from "react-icons/io5";
import SettingIcon from "public/icon/settings.svg";
import { Progressbar } from "../common/progresbar";
import Bar from "../common/skeleton/bar";

interface HybridSwapProps {
  isLoading?: boolean;
  useLiFiWidget?: boolean;
  onSwapModeChange?: (mode: "market" | "limit") => void;
  onRouteUpdate?: (route: any) => void;
  onExecutionComplete?: (result: any) => void;
}

const HybridSwap = ({
  isLoading = false,
  useLiFiWidget = false,
  onSwapModeChange,
  onRouteUpdate,
  onExecutionComplete,
}: HybridSwapProps) => {
  const [isPrivacy, setIsPrivacy] = useState(false);
  const [mode, setMode] = useState<"market" | "limit">("market");
  const [limitValue, setLimitValue] = useState("");
  const [showLiFiWidget, setShowLiFiWidget] = useState(useLiFiWidget);
  const [isWidgetLoading, setIsWidgetLoading] = useState(false);
  const [fromToken, setFromToken] = useState(null);
  const [fromChain, setFromChain] = useState(null);
  const [fromAmount, setFromAmount] = useState(0);
  const [toToken, setToToken] = useState(null);
  const [toChain, setToChain] = useState(null);
  const [toAmount, setToAmount] = useState(0);

  const widgetRef = useRef<WidgetDrawer>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const formRef = useRef(null);
  const lifiServiceInstance = lifiService;

  // Handle mode change
  const handleModeChange = useCallback(
    (newMode: number) => {
      const modeType = newMode === 1 ? "market" : "limit";
      setMode(modeType);
      onSwapModeChange?.(modeType);
    },
    [onSwapModeChange]
  );

  // LiFi Widget Configuration
  const widgetConfig: WidgetConfig = {
    integrator: "aetherdapp",
    variant: "compact",
    appearance: "dark",
    theme: {
      container: {
        borderRadius: "12px",
        boxShadow: "none",
        background: "transparent",
        border: "none",
      },
      colorSchemes: {
        dark: {
          palette: {
            primary: {
              main: "#bb3eff",
              contrastText: "#ffffff",
            },
            secondary: {
              main: "#1a1a1a",
              contrastText: "#ffffff",
            },
            background: {
              default: "#0a0a0a",
              paper: "#1a1a1a",
            },
            text: {
              primary: "#ffffff",
              secondary: "#a0a0a0",
            },
          },
        },
      },
    },
    hiddenUI: ["poweredBy", "history", "language", "appearance"],
    slippage: 0.5,
    routePriority: "RECOMMENDED",
    useRecommendedRoute: true,
  };

  // Handle widget events
  const handleWidgetEvents = useCallback(() => {
    const cleanup = lifiServiceInstance.setupEventListeners({
      onRouteExecutionStarted: () => {
        setIsWidgetLoading(true);
      },
      onRouteExecutionCompleted: (event) => {
        setIsWidgetLoading(false);
        onExecutionComplete?.(event);
      },
      onRouteExecutionFailed: () => {
        setIsWidgetLoading(false);
      },
      onRouteUpdate: (event) => {
        onRouteUpdate?.(event);
      },
    });
    return cleanup;
  }, [lifiServiceInstance, onExecutionComplete, onRouteUpdate]);

  // Handle widget reference
  const handleWidgetRef = useCallback(
    (ref: WidgetDrawer | null) => {
      if (ref) {
        lifiServiceInstance.setWidgetRef(ref);
        widgetRef.current = ref;
      }
    },
    [lifiServiceInstance]
  );

  // Toggle between custom UI and LiFi widget
  const toggleWidget = () => {
    setShowLiFiWidget(!showLiFiWidget);
  };

  if (showLiFiWidget) {
    return (
      <div className="bg-card border-[1px] border-input p-6 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Cross-Chain Swap</h3>
          <button
            onClick={toggleWidget}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Use Custom UI
          </button>
        </div>

        <div className="relative min-h-[400px]">
          <LiFiWidget
            ref={handleWidgetRef}
            config={widgetConfig}
            integrator="aetherdapp"
            elementRef={elementRef as React.RefObject<HTMLDivElement>}
            formRef={formRef}
          />
          {isWidgetLoading && (
            <div className="absolute inset-0 bg-card/80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  Processing swap...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-[1px] border-input p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <SwitchButton
          isLoading={isLoading}
          value={mode === "market" ? 1 : 2}
          setValue={handleModeChange}
          firstOptionName="Market"
          secondOptionName="Limit"
        />
        <button
          onClick={toggleWidget}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Use LiFi Widget
        </button>
      </div>

      <div className="relative">
        <TokenPanel
          title="From"
          isLoading={isLoading}
          setToken={setFromToken}
          token={fromToken}
          setChain={setFromChain}
          chain={fromChain}
          setAmount={setFromAmount}
          amount={fromAmount}
        />
        {mode === "limit" && (
          <div className="flex flex-col gap-2.5 mt-2.5">
            <div className="text-sm text-muted-foreground font-medium">
              Limit price
            </div>
            <input
              type="number"
              className="bg-background border border-input px-3 py-2.5 w-full text-sm outline-none rounded"
              placeholder="Price in RNDR"
              value={limitValue}
              onChange={(e) => setLimitValue(e.target.value)}
            />
          </div>
        )}
        <div
          className={`absolute ${
            mode === "market" ? "bottom-[-40.5px]" : "bottom-[-70.5px]"
          } left-[calc(50%-22.5px)] bg-card border-[1px] border-input rounded-full p-2 flex justify-center items-center w-15 h-15`}
        >
          <div className="w-[45px] h-[45px] flex items-center justify-center bg-background rounded-full">
            <IoSwapVertical size={20} />
          </div>
        </div>
      </div>

      <div className={`${mode === "market" ? "" : "mt-16"}`}>
        <TokenPanel
          title="To"
          isLoading={isLoading}
          setToken={setToToken}
          token={toToken}
          setChain={setToChain}
          chain={toChain}
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
          className="!border-none pl-0"
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
              <div className="cursor-pointer w-10 h-7 border border-input bg-background flex items-center justify-center text-xs text-muted-foreground rounded">
                0.1%
              </div>
              <div className="cursor-pointer w-10 h-7 border border-input bg-background flex items-center justify-center text-xs text-muted-foreground rounded">
                0.5%
              </div>
              <div className="cursor-pointer w-10 h-7 border border-input bg-background flex items-center justify-center text-xs text-muted-foreground rounded">
                1%
              </div>
            </div>
          </div>
        </DetailAccordion>
      )}

      {isPrivacy && <SwapTransactionDetail />}

      <button className="w-full h-10 gradient-bg text-xs text-foreground cursor-pointer rounded">
        {isLoading && <Bar barClassName="w-8 h-3 mx-auto" />}
        {!isLoading && "Swap"}
      </button>
    </div>
  );
};

export default HybridSwap;

"use client";

import React, { useState } from "react";
import Head from "next/head";
import {
  FiUsers,
  FiAward,
  FiZap,
  FiTarget,
  FiShare2,
  FiExternalLink,
  FiStar,
} from "react-icons/fi";
import { useAccount } from "wagmi";

const ReferralPage = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("referral");

  const referralCode =
    isConnected && address
      ? `AETH-${address.slice(0, 4).toUpperCase()}-${address
          .slice(-4)
          .toUpperCase()}`
      : "AETH-XXXX-XXXX";

  const referralLink = `https://aetherdex.com/ref/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    // Optional: Add toast notification here
  };

  const handleShareOnX = () => {
    const text = `Just joined the AetherDex Referral Program! 🚀\nTrade with low fees and earn rewards.\n\nJoin me here: ${referralLink}\n\n#AetherDex #DeFi`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  // Theme variables based on the designer's provided values
  const themeStyles = {
    "--theme-input": "#3F2A63",
    "--theme-card": "#110C2A",
    "--theme-secondary": "#FB9B00",
    "--theme-background": "#010314",
    "--theme-muted-foreground": "#D2D2D2",
    "--theme-muted": "#06081E",
    "--theme-foreground": "#FAFCF8",
    "--theme-primary": "#BB3EFF",
    "--theme-border": "#997740",
    "--theme-primary-foreground": "white",
    "--color-green-500": "#00C951",
    "--color-green-600": "#00A63E",
    "--color-orange-500": "#FF6900",
    "--color-cyan-500": "#00B8DB",
    "--color-yellow-500": "#EFB100",
    "--color-white": "white",
  } as React.CSSProperties;

  return (
    <div
      style={themeStyles}
      className="ml-0 sm:ml-50 min-h-screen font-geist-mono"
    >
      <Head>
        <title>AetherDex | Referral Program</title>
        <meta
          name="description"
          content="Join AetherDex Referral Program and earn rewards from trading fees."
        />
      </Head>

      {/* Header Section (Matching Dashboard/Portfolio) */}
      <div className="h-[106px] flex items-center px-[32px] border-y-[1px] border-[var(--theme-input)]">
        <div className="flex flex-col gap-[6px]">
          <b className="text-[var(--theme-foreground)] text-xl font-semibold">
            Referral & Rewards
          </b>
          <p className="text-[var(--theme-muted-foreground)] text-xs md:text-sm">
            Build your community and earn a share of every trade they make.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          width: "100%",
          padding: 32,
          borderBottom: "1px var(--theme-input) solid",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 24,
          display: "inline-flex",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            alignSelf: "stretch",
            justifyContent: "space-between",
            alignItems: "flex-start",
            display: "inline-flex",
          }}
        >
          <div
            style={{
              flex: "1 1 0",
              height: 56,
              paddingLeft: 6,
              paddingRight: 6,
              paddingTop: 4,
              paddingBottom: 4,
              background: "var(--theme-card)",
              overflow: "hidden",
              outline: "1px #5C14AF solid",
              outlineOffset: "-1px",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 8,
              display: "flex",
            }}
          >
            <div
              onClick={() => setActiveTab("referral")}
              style={{
                flex: "1 1 0",
                height: 40,
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                background:
                  activeTab === "referral"
                    ? "var(--theme-secondary)"
                    : "transparent",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                display: "flex",
                cursor: "pointer",
              }}
            >
              <FiUsers
                size={16}
                style={{
                  color:
                    activeTab === "referral"
                      ? "var(--theme-background)" // Icons on active tab (which has a background color) usually need to contrast against it.
                      : // However, looking at the text style:  activeTab === "referral" ? "var(--theme-background)" ...
                        // If the background of the tab is "var(--theme-secondary)" (orange/yellow?), and text is "var(--theme-background)" (dark?),
                        // then the icon should also be "var(--theme-background)".
                        "var(--theme-muted-foreground)",
                }}
              />
              <div
                style={{
                  color:
                    activeTab === "referral"
                      ? "var(--theme-background)"
                      : "var(--theme-muted-foreground)",
                  fontSize: 14,
                  fontWeight: activeTab === "referral" ? "600" : "400",
                  lineHeight: 20,
                }}
              >
                Referral Program
              </div>
            </div>
            <div
              onClick={() => setActiveTab("airdrops")}
              style={{
                flex: "1 1 0",
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                borderRadius: 2,
                background:
                  activeTab === "airdrops"
                    ? "var(--theme-secondary)"
                    : "transparent",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                display: "flex",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: 10.67,
                    height: 7.33,
                    left: 2.67,
                    top: 7.33,
                    position: "absolute",
                    borderRadius: 3.5,
                    outline:
                      activeTab === "airdrops"
                        ? "1.50px var(--theme-background) solid"
                        : "1.50px var(--theme-muted-foreground) solid",
                    outlineOffset: "-0.75px",
                  }}
                />
                <div
                  style={{
                    width: 12,
                    height: 2.67,
                    left: 2,
                    top: 4.67,
                    position: "absolute",
                    borderRadius: 1.5,
                    outline:
                      activeTab === "airdrops"
                        ? "1.50px var(--theme-background) solid"
                        : "1.50px var(--theme-muted-foreground) solid",
                    outlineOffset: "-0.75px",
                  }}
                />
                <div
                  style={{
                    width: 4,
                    height: 3.33,
                    left: 4,
                    top: 1.33,
                    position: "absolute",
                    outline:
                      activeTab === "airdrops"
                        ? "1.50px var(--theme-background) solid"
                        : "1.50px var(--theme-muted-foreground) solid",
                    outlineOffset: "-0.75px",
                  }}
                />
                <div
                  style={{
                    width: 4,
                    height: 3.33,
                    left: 8,
                    top: 1.33,
                    position: "absolute",
                    outline:
                      activeTab === "airdrops"
                        ? "1.50px var(--theme-background) solid"
                        : "1.50px var(--theme-muted-foreground) solid",
                    outlineOffset: "-0.75px",
                  }}
                />
              </div>
              <div
                style={{
                  color:
                    activeTab === "airdrops"
                      ? "var(--theme-background)"
                      : "var(--theme-muted-foreground)",
                  fontSize: 12,
                  fontWeight: activeTab === "airdrops" ? "600" : "400",
                  lineHeight: 16,
                }}
              >
                Airdrops
              </div>
            </div>
          </div>
        </div>

        {activeTab === "referral" && (
          <div
            style={{
              alignSelf: "stretch",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 24,
              display: "inline-flex",
              flexWrap: "wrap",
            }}
          >
            {/* Left Column */}
            <div
              style={{
                flex: "1 1 771px",
                minWidth: "320px",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 14,
                display: "inline-flex",
              }}
            >
              {/* Dashboard Stats */}
              <div
                style={{
                  alignSelf: "stretch",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 12,
                  display: "inline-flex",
                  flexWrap: "wrap",
                }}
              >
                {/* Stat Card 1 */}
                <div
                  style={{
                    flex: "1 1 180px",
                    height: 106,
                    paddingTop: 16,
                    paddingBottom: 8,
                    paddingLeft: 12,
                    paddingRight: 12,
                    background: "var(--theme-card)",
                    boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.06)",
                    outline: "1px var(--theme-input) solid",
                    outlineOffset: "-1px",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 6,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      flex: "1 1 0",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: 8,
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        alignSelf: "stretch",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          color: "var(--theme-muted-foreground)",
                          fontSize: 12,
                          lineHeight: "16px",
                        }}
                      >
                        Total Referral
                      </div>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FiUsers
                          size={24}
                          style={{ color: "var(--theme-primary)" }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: 4,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "stretch",
                          color: "var(--theme-foreground)",
                          fontSize: 16,
                          fontWeight: "600",
                          lineHeight: "24px",
                        }}
                      >
                        0
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          color: "var(--theme-muted-foreground)",
                          fontSize: 12,
                          lineHeight: "16px",
                        }}
                      >
                        0 active
                      </div>
                    </div>
                  </div>
                </div>
                {/* Stat Card 2 */}
                <div
                  style={{
                    flex: "1 1 180px",
                    height: 106,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 16,
                    paddingBottom: 16,
                    background: "var(--theme-card)",
                    boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.06)",
                    outline: "1px var(--theme-input) solid",
                    outlineOffset: "-1px",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 6,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      flex: "1 1 0",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: 8,
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        alignSelf: "stretch",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          color: "var(--theme-muted-foreground)",
                          fontSize: 12,
                          lineHeight: "16px",
                        }}
                      >
                        Total Earned
                      </div>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FiAward
                          size={24}
                          style={{ color: "var(--color-orange-500)" }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        alignSelf: "stretch",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: 4,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "stretch",
                          color: "var(--theme-foreground)",
                          fontSize: 16,
                          fontWeight: "600",
                          lineHeight: "24px",
                        }}
                      >
                        0.00 AETH
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          color: "var(--color-green-500)",
                          fontSize: 12,
                          lineHeight: "16px",
                        }}
                      >
                        ≈ $0.00
                      </div>
                    </div>
                  </div>
                </div>
                {/* Stat Card 3 */}
                <div
                  style={{
                    flex: "1 1 180px",
                    height: 106,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 16,
                    paddingBottom: 16,
                    background: "var(--theme-card)",
                    boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.06)",
                    outline: "1px var(--theme-input) solid",
                    outlineOffset: "-1px",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 6,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      flex: "1 1 0",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: 8,
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        alignSelf: "stretch",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          color: "var(--theme-muted-foreground)",
                          fontSize: 12,
                          lineHeight: "16px",
                        }}
                      >
                        Pending Rewards
                      </div>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FiZap
                          size={24}
                          style={{ color: "var(--theme-secondary)" }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        alignSelf: "stretch",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: 4,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "stretch",
                          color: "var(--theme-foreground)",
                          fontSize: 16,
                          fontWeight: "600",
                          lineHeight: "24px",
                        }}
                      >
                        0.00 AETH
                      </div>
                      <div
                        style={{
                          color: "var(--theme-secondary)",
                          fontSize: 12,
                          lineHeight: "16px",
                        }}
                      >
                        No pending payouts
                      </div>
                    </div>
                  </div>
                </div>
                {/* Stat Card 4 */}
                <div
                  style={{
                    flex: "1 1 180px",
                    height: 106,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 16,
                    paddingBottom: 16,
                    background: "var(--theme-card)",
                    boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.06)",
                    outline: "1px var(--theme-input) solid",
                    outlineOffset: "-1px",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 6,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      flex: "1 1 0",
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: 8,
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        alignSelf: "stretch",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          color: "var(--theme-muted-foreground)",
                          fontSize: 12,
                          lineHeight: "16px",
                        }}
                      >
                        Current Tier
                      </div>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FiTarget
                          size={24}
                          style={{ color: "var(--color-cyan-500)" }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: 4,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          alignSelf: "stretch",
                          color: "var(--theme-foreground)",
                          fontSize: 16,
                          fontWeight: "600",
                          lineHeight: "24px",
                        }}
                      >
                        Bronze
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          color: "var(--color-green-500)",
                          fontSize: 12,
                          lineHeight: "16px",
                        }}
                      >
                        10% commission
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Link Box */}
              <div
                style={{
                  alignSelf: "stretch",
                  padding: 24,
                  background: "var(--theme-card)",
                  overflow: "hidden",
                  outline: "1px var(--theme-input) solid",
                  outlineOffset: "-1px",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: 20,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    height: 40,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 6,
                    paddingBottom: 6,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 8,
                    display: "inline-flex",
                    borderBottom: "1px solid var(--theme-input)",
                  }}
                >
                  <div
                    style={{
                      color: "var(--theme-foreground)",
                      fontSize: 14,
                      fontWeight: "600",
                      lineHeight: 20,
                    }}
                  >
                    Your Referral Link
                  </div>
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 16,
                    paddingBottom: 16,
                    background: "var(--theme-muted)",
                    outline: "1px var(--theme-input) solid",
                    outlineOffset: "-1px",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 12,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "stretch",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: 4,
                      display: "flex",
                    }}
                  >
                    <div className="w-full flex-col sm:flex-row flex items-center justify-center gap-3">
                      <div className="w-full sm:flex-1 h-10 px-3 py-2 bg-[var(--theme-background)] outline outline-1 outline-[var(--theme-input)] overflow-hidden flex items-center gap-2">
                        <div className="text-[var(--theme-muted-foreground)] text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                          {referralLink}
                        </div>
                      </div>
                      <div
                        onClick={handleCopyLink}
                        className="h-9 cursor-pointer px-4 py-2 flex items-center justify-center gap-1.5 w-full sm:w-auto"
                        style={{
                          background:
                            "linear-gradient(60deg, #5C14AF 0%, rgba(251, 155, 0, 0.76) 100%)",
                        }}
                      >
                        <div className="w-5 h-5 relative overflow-hidden">
                          <div
                            style={{
                              width: 10.83,
                              height: 10.83,
                              left: 7.5,
                              top: 7.5,
                              position: "absolute",
                              borderRadius: 3,
                              outline:
                                "1.50px var(--theme-muted-foreground) solid",
                              outlineOffset: "-0.75px",
                            }}
                          />
                          <div
                            style={{
                              width: 12.5,
                              height: 12.5,
                              left: 1.67,
                              top: 1.67,
                              position: "absolute",
                              outline:
                                "1.50px var(--theme-muted-foreground) solid",
                              outlineOffset: "-0.75px",
                            }}
                          />
                        </div>
                        <div className="text-[var(--theme-primary-foreground)] text-sm font-medium leading-5">
                          Copy
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-[var(--theme-muted-foreground)] text-xs leading-4">
                      Share this link to earn 10% comission on all trading fees
                      from your referrals
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start justify-center sm:justify-start gap-4 w-full">
                    <div
                      onClick={handleShareOnX}
                      className="h-9 cursor-pointer px-4 py-2 flex items-center justify-center gap-1.5 w-full sm:w-auto outline outline-1 outline-[var(--theme-border)]"
                    >
                      <div className="w-5 h-5 flex justify-center items-center">
                        <FiShare2
                          size={18}
                          style={{ color: "var(--theme-primary-foreground)" }}
                        />
                      </div>
                      <div className="text-[var(--theme-primary-foreground)] text-sm font-medium">
                        Share on X
                      </div>
                    </div>
                    <div className="h-9 cursor-pointer px-4 py-2 flex items-center justify-center gap-1.5 w-full sm:w-auto outline outline-1 outline-[var(--theme-border)]">
                      <div className="w-5 h-5 flex justify-center items-center">
                        <FiExternalLink
                          size={18}
                          style={{ color: "var(--theme-primary-foreground)" }}
                        />
                      </div>
                      <div className="text-[var(--theme-primary-foreground)] text-sm font-medium">
                        View Leaderboard
                      </div>
                    </div>
                    <div className="h-9 cursor-pointer px-4 py-2 flex items-center justify-center gap-1.5 w-full sm:w-auto outline outline-1 outline-[var(--theme-border)]">
                      <div className="w-5 h-5 flex justify-center items-center">
                        <FiAward
                          size={18}
                          style={{ color: "var(--theme-primary-foreground)" }}
                        />
                      </div>
                      <div className="text-[var(--theme-primary-foreground)] text-sm font-medium">
                        Referral Contest
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral History Table */}
              <div
                style={{
                  alignSelf: "stretch",
                  padding: 32,
                  background: "var(--theme-card)",
                  outline: "1px var(--theme-input) solid",
                  outlineOffset: "-1px",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 16,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 16,
                    display: "inline-flex",
                  }}
                >
                  <div
                    style={{
                      color: "var(--theme-foreground)",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Referral History
                  </div>
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    overflowX: "auto",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{ borderBottom: "1px var(--theme-input) solid" }}
                      >
                        <th
                          style={{
                            padding: 12,
                            textAlign: "left",
                            color: "var(--theme-muted-foreground)",
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            padding: 12,
                            textAlign: "left",
                            color: "var(--theme-muted-foreground)",
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          Referee
                        </th>
                        <th
                          style={{
                            padding: 12,
                            textAlign: "left",
                            color: "var(--theme-muted-foreground)",
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          Trading Volume
                        </th>
                        <th
                          style={{
                            padding: 12,
                            textAlign: "left",
                            color: "var(--theme-muted-foreground)",
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          Your Reward
                        </th>
                        <th
                          style={{
                            padding: 12,
                            textAlign: "left",
                            color: "var(--theme-muted-foreground)",
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[].length > 0 ? (
                        [].map((row: any, i) => (
                          <tr key={i}>
                            <td>{/* row data */}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            style={{
                              padding: 24,
                              textAlign: "center",
                              color: "var(--theme-muted-foreground)",
                              fontSize: 14,
                            }}
                          >
                            No referral history found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div
              style={{
                flex: "1 1 453px",
                minWidth: "320px",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 24,
                display: "inline-flex",
              }}
            >
              {/* Tier Progress Card */}
              <div
                style={{
                  alignSelf: "stretch",
                  padding: 24,
                  background: "var(--theme-card)",
                  outline: "1px var(--theme-input) solid",
                  outlineOffset: "-1px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 16,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 6,
                      display: "inline-flex",
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FiStar
                        size={20}
                        style={{ color: "var(--theme-secondary)" }}
                      />
                    </div>
                    <div
                      style={{
                        color: "var(--theme-foreground)",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      Tier Progress
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    paddingTop: 4,
                    paddingBottom: 4,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 10,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "stretch",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      display: "inline-flex",
                    }}
                  >
                    <div
                      style={{
                        color: "var(--theme-muted-foreground)",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      Current: Bronze
                    </div>
                    <div
                      style={{
                        color: "var(--theme-muted-foreground)",
                        fontSize: 12,
                        fontWeight: "500",
                      }}
                    >
                      0/5 referrals
                    </div>
                  </div>
                  <div
                    style={{
                      alignSelf: "stretch",
                      height: 8,
                      position: "relative",
                      background: "var(--theme-input)",
                      borderRadius: 4,
                    }}
                  >
                    <div
                      style={{
                        width: "0%",
                        height: 8,
                        background: "var(--theme-primary)",
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      color: "var(--theme-muted-foreground)",
                      fontSize: 12,
                    }}
                  >
                    5 more referrals to Silver
                  </div>
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    height: 1,
                    background: "var(--theme-input)",
                  }}
                />
                <div
                  style={{
                    alignSelf: "stretch",
                    color: "var(--theme-foreground)",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Current Benefits
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "space-between",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      color: "var(--theme-muted-foreground)",
                      fontSize: 12,
                    }}
                  >
                    Commission Rate
                  </div>
                  <div
                    style={{
                      color: "var(--color-green-500)",
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                  >
                    10%
                  </div>
                </div>

                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "space-between",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      color: "var(--theme-muted-foreground)",
                      fontSize: 12,
                    }}
                  >
                    Bonus Features
                  </div>
                  <div
                    style={{
                      color: "var(--theme-muted-foreground)",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Exclusive Events
                  </div>
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "space-between",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      color: "var(--theme-muted-foreground)",
                      fontSize: 12,
                    }}
                  >
                    Support Level
                  </div>
                  <div
                    style={{
                      color: "var(--theme-muted-foreground)",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Priority
                  </div>
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    height: 1,
                    background: "var(--theme-input)",
                  }}
                />
                {/* Tier Boxes */}
                <div
                  style={{
                    alignSelf: "stretch",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      padding: "20px 16px",
                      background: "var(--theme-card)",
                      outline: "1px var(--theme-input) solid",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{ color: "var(--theme-secondary)", fontSize: 14 }}
                    >
                      Bronze
                    </div>
                    <div
                      style={{ color: "var(--color-green-500)", fontSize: 12 }}
                    >
                      10%
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px 16px",
                      background:
                        "linear-gradient(60deg, #5C14AF 0%, rgba(251, 155, 0, 0.76) 100%)",
                      outline: "1px var(--theme-input) solid",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ color: "white", fontSize: 14 }}>Silver</div>
                    <div
                      style={{ color: "var(--color-green-500)", fontSize: 12 }}
                    >
                      15%
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px 16px",
                      background: "var(--theme-card)",
                      outline: "1px var(--theme-input) solid",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{ color: "var(--color-yellow-500)", fontSize: 14 }}
                    >
                      Gold
                    </div>
                    <div
                      style={{ color: "var(--color-green-500)", fontSize: 12 }}
                    >
                      20%
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px 16px",
                      background: "var(--theme-card)",
                      outline: "1px var(--theme-input) solid",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{ color: "var(--theme-primary)", fontSize: 14 }}
                    >
                      Platinum
                    </div>
                    <div
                      style={{ color: "var(--color-green-500)", fontSize: 12 }}
                    >
                      25%
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Rules Card */}
              <div
                style={{
                  alignSelf: "stretch",
                  padding: 24,
                  background: "var(--theme-card)",
                  outline: "1px var(--theme-input) solid",
                  outlineOffset: "-1px",
                  flexDirection: "column",
                  gap: 24,
                  display: "flex",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="/icon/hammer.svg"
                      style={{ width: 20, height: 20 }}
                      alt="Rules"
                    />
                  </div>
                  <div
                    style={{
                      color: "var(--theme-foreground)",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Program Rules
                  </div>
                </div>
                <div
                  style={{
                    flexDirection: "column",
                    gap: 12,
                    display: "flex",
                    opacity: 0.8,
                  }}
                >
                  {[
                    "Rewards paid weekly in AETH",
                    "Minimum 0.1 AETH to claim",

                    "Commission based on trading fees",
                    "Tier upgrades are permanent",
                  ].map((rule, i) => (
                    <div
                      key={i}
                      style={{
                        color: "var(--theme-muted-foreground)",
                        fontSize: 12,
                      }}
                    >
                      • {rule}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "airdrops" && (
          <div className="w-full flex justify-center items-center py-20">
            <div
              style={{ color: "var(--theme-muted-foreground)", fontSize: 16 }}
            >
              Airdrops information coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralPage;

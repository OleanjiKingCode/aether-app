import BaseCard from "../common/base-card";
import Bar from "../common/skeleton/bar";
import { useEffect, useState } from "react";
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
} from "recharts";

const StakingPerformance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const width = useDeviceWidth();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);
  const mockData: any = [
    // { time: '2hrs', price: 1, label: "1k" },
    // { time: '4hrs', price: 5000, label: "5k" },
    // { time: '6hrs', price: 2000, label: "2k" },
    // { time: '8hrs', price: 3000, label: "3k" },
    // { time: '10hrs', price: 7000, label: "7k" },
  ];
  return (
    <BaseCard className="p-6 flex flex-col w-full">
      <div className="text-sm text-foreground font-semibold">
        Staking Performance
      </div>
      <div className="text-xs text-muted-foreground mt-1.5">
        Monthly reward over time
      </div>
      <div className="h-fit mt-5">
        {isLoading === true && <Bar barClassName="w-full h-36" />}
        {!isLoading && (
          <ResponsiveContainer width="100%" height={width > 500 ? 330 : 106}>
            <AreaChart
              width={width > 500 ? 500 : width - 80}
              height={width > 500 ? 300 : 106}
              data={mockData}
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
              <Tooltip contentStyle={{ background: "#06081E" }} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#BB3EFF"
                fill="url(#paint0_linear_1240_12791)"
                fillOpacity={0.2}
              />

              <defs>
                <linearGradient
                  id="paint0_linear_1240_12791"
                  x1="337"
                  y1="-71.6575"
                  x2="355.03"
                  y2="287.621"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#BB3EFF" />
                  <stop offset="1" stop-color="#C686F8" stop-opacity="0.01" />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </BaseCard>
  );
};

export default StakingPerformance;

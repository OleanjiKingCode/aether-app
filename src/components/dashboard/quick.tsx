import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Bar from "../common/skeleton/bar";

const Quick = () => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, [])

  const quickaction = [
    {
      img: "/icon/swaptoken.svg",
      title: "Swap Tokens",
      paragraph: "Exchange Tokens Instantly",
      path: "/swap",
    },
    {
      img: "/icon/Stake.svg",
      title: "Stake $AETH",
      paragraph: "Earn 10.2% APY rewards",
      path: "/staking",
    },
    {
      img: "/icon/Portfolio_img.svg",
      title: "View Portfolio",
      paragraph: "Track your assets",
      path: "/portfolio",
    },
    {
      img: "/icon/governance_img.svg",
      title: "Governance",
      paragraph: "Participate in Governance",
      path: "/governance",
    },
  ];
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex flex-row w-full justify-between">
        <b className="text-foreground">Quick Actions</b>
        <div className="border-[1px] border-input w-[110px] flex items-center justify-center">
          <div className="flex flex-row gap-2">
            <Image src={"/icon/star_img.svg"} width={14} height={14} alt="" />
            <b className="text-[12px] text-[#D2D2D2]">AI Powered</b>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between flex-col xl:flex-row gap-3 xl:gap-0 ">
        {quickaction.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className="w-full max-w-250 xl:max-w-full xl:w-[294px] border-input bg-card border-[1px] flex h-[80px] py-[20px] px-[16px]"
          >
            <div className="flex flex-row items-start gap-[16px]">
              {isLoading === true && (<Bar barClassName="w-6 h-6" />)}
              {!isLoading && (<Image src={item.img} width={25.14} height={25.14} alt="" />)}
              <div className="flex flex-col gap-[4px]">
                {isLoading === true && (<Bar barClassName="w-42 h-3" />)}
                {!isLoading && (<b className="text-foreground">{item.title}</b>)}
                {isLoading === true && (<Bar barClassName="w-35 h-2.5" />)}
                {!isLoading && (<p className="text-[12px]">{item.paragraph}</p>)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Quick;

import Image from "next/image";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IconType } from "react-icons";
import BaseCard from "../common/base-card";
import Bar from "../common/skeleton/bar";

interface DetailAccordionProps {
  title: string;
  icon: string | IconType;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const DetailAccordion = ({
  title,
  icon,
  children,
  className,
  isLoading,
}: DetailAccordionProps) => {
  const [isShow, setIsShow] = useState(false);

  const showDetail = () => {
    setIsShow(!isShow);
  };

  const Icon = typeof icon === "string" ? null : icon;

  return (
    <BaseCard className={`pb-3.5 flex flex-col gap-2.5 ${className}`}>
      <div className="flex justify-between">
        <div className="flex gap-1.5 items-center">
          <div className="">
            {isLoading && <Bar barClassName="w-3 h-3" />}
            {!isLoading &&
              (typeof icon === "string" ? (
                <Image src={icon} width={20} height={20} alt="" />
              ) : Icon ? (
                <Icon size={20} />
              ) : null)}
          </div>
          <div className="text-base text-foreground">
            {isLoading && <Bar barClassName="w-20 h-4" />}
            {!isLoading && title}
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-[24px] w-[24px] transition-transform duration-300 origin-center ${
            isShow ? "rotate-180" : "rotate-0"
          }`}
          onClick={showDetail}
        >
          <IoChevronDown size={20} />
        </div>
      </div>
      <div
        className={`transition-all duration-300 ${
          isShow ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {isShow && children}
      </div>
    </BaseCard>
  );
};

export default DetailAccordion;

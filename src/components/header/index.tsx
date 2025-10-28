import Image from "next/image";
import UnifiedWallet from "../unified-wallet";
import { useId, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { IoMenuOutline } from "react-icons/io5";



const Header = () => {
  const [checked, setChecked] = useState(false);
  const checkBoxId = useId()
  const { isShowMobileMenu, setIsShowMobileMenu } = useGlobalContext()

  const handleShowMobileMenu = () => {
    setIsShowMobileMenu(!isShowMobileMenu)
  }

  return (
    <div className="h-[84px] flex w-full items-center px-4 md:px-[32px] justify-between">
      <div>
        <div className="w-[35px] flex items-center justify-center h-[35px]">
          <Image
            src={"/icon/logo-mobile.svg"}
            width={35}
            height={35}
            alt="notification_icon"
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-[16px]">

        <div>
          <div className="w-[35px] flex items-center justify-center h-[35px] border-input border-[1px]">
            <Image
              src={"/icon/notifications.svg"}
              width={18}
              height={18}
              alt="notification_icon"
            />
          </div>
        </div>
        <div className="hidden md:flex flex-row items-center gap-[12px]">
          <div className="flex flex-row gap-[8px] items-center px-[16px] w-55 h-[34px] border-input border-[1px]">
            <div className="flex flex-row items-center gap-1 w-full">
              <Image
                src={"/icon/privacy.svg"}
                width={16}
                height={16}
                alt="privacy_img"
              />
              <p className="text-[#D2D2D2] text-[12px]">Privacy Mode</p>
            </div>
            <div className="relative inline-block h-5 w-11">
              <input
                checked={checked}
                className="peer h-4 w-9 cursor-pointer appearance-none bg-input transition-colors duration-300 checked:bg-primary rounded-full"
                id={checkBoxId}
                onChange={() => {
                  setChecked(!checked);
                }}
                type="checkbox"
              />
              <label
                aria-labelledby="A label"
                className="absolute top-[1px] left-[2px] h-4 w-4 cursor-pointer border bg-background rounded-full shadow-sm transition-transform duration-300 peer-checked:translate-x-4.5 peer-checked:border-primary"
                htmlFor={checkBoxId}
              />
            </div>
            <div className="w-[25px] h-[16px] flex items-center justify-center border-[#FFFFFF33] border-[1px]">
              <p className={`px-1 font-bold ${checked ? 'text-secondary' : 'text-[#FFFFFF33]'}  text-[9px]`}>{checked ? 'ON' : 'OFF'}</p>
            </div>
          </div>
        </div>
        <UnifiedWallet isShowNetwork={true} />
        <div className="h-[34px] flex items-center justify-center border-[1px] border-input">
          <div className="flex flex-row gap-2 items-center px-4">
            <Image src={"/icon/askAI.svg"} width={16} height={16} alt="askAI" />
            <p className="hidden md:block text-[12px] text-[#D2D2D2]">Ask AI</p>
          </div>
        </div>
        <div className="border-input border-[1px] px-4 py-[9px] block sm:hidden" onClick={handleShowMobileMenu}>
          <IoMenuOutline size={14} />
        </div>
      </div>
    </div>
  );
};

export default Header;

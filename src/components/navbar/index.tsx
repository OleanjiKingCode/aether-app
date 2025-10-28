"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDE_BAR_PAGES } from "@/config/constant/environment";
import Logo from "public/icon/logo.svg"
import { useGlobalContext } from "@/context/GlobalContext";

const Navbar = () => {
  const { isShowMobileMenu, setIsShowMobileMenu } = useGlobalContext()

  const pathName = usePathname();
  return (
    <div className={`z-50 fixed h-screen top-0 left-[-200px] translate-x-0 ${isShowMobileMenu ? 'translate-x-50 transition-transform duration-300' : 'transition-transform duration-300'} sm:!left-0  w-[200px] border-input border-[1px] bg-card `}>
      <div className="w-full h-[84px] border-b border-input flex items-center justify-center">
        <Image src={Logo} alt="logo" width={100} height={100} />
      </div>
      <div className="py-6 px-[8px] font-geist-mono">
        <div className="flex flex-col gap-[12px]">
          {SIDE_BAR_PAGES.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              className={`flex flex-row items-center gap-[8px] w-full h-[40px] px-[20px] ${pathName === item.path ? "gradient-bg font-semibold" : "font-normal"
                } `}
            >
              <Image src={item.icon} width={16} height={16} alt={item.title} />
              <p>{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface AlertModal {
  show: boolean;
  type: string;
  message: string;
}
interface ToastType {
  show: boolean;
  type: "success" | "error" | "info";
  message: string;
}

interface GlobalContextType {
  alertModal: AlertModal;
  setAlertModal: (updatedStatus: AlertModal) => void;
  toast: ToastType;
  setToast: (toast: ToastType) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  screenLoadingStatus: string;
  setScreenLoadingStatus: (status: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isShowMobileMenu: boolean;
  setIsShowMobileMenu: (value: boolean) => void;
  referralCode: string | null;
  setReferralCode: (code: string | null) => void;
}

// Create the context with a default value of undefined
const GlobalContext = createContext<GlobalContextType>({
  alertModal: { show: false, type: "", message: "" },
  setAlertModal: () => {},
  toast: { show: false, type: "info", message: "" },
  setToast: (toast: ToastType) => {},
  notifySuccess: (message: string) => {},
  notifyError: (message: string) => {},
  notifyInfo: (message: string) => {},
  screenLoadingStatus: "",
  setScreenLoadingStatus: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isShowMobileMenu: false,
  setIsShowMobileMenu: () => {},
  referralCode: null,
  setReferralCode: () => {},
});

// Define the props for the provider
interface GlobalProviderProps {
  children: ReactNode;
}

// Create a provider component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [toast, setToast] = useState<ToastType>({
    show: false,
    type: "info",
    message: "",
  });
  const [screenLoadingStatus, setScreenLoadingStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for referral code on mount
    const storedCode = localStorage.getItem("aether_referral_code");
    if (storedCode) {
      setReferralCode(storedCode);
    }
  }, []);

  useEffect(() => {
    if (
      screenLoadingStatus.includes("fail") ||
      screenLoadingStatus.includes("Failed") ||
      screenLoadingStatus.includes("Complete") ||
      screenLoadingStatus.includes("success") ||
      screenLoadingStatus.includes("Success")
    ) {
      setTimeout(() => {
        setScreenLoadingStatus("");
      }, 2000);
    }
  }, [screenLoadingStatus]);

  const notifySuccess = (message: string) =>
    setToast({ show: true, type: "success", message });
  const notifyError = (message: string) =>
    setToast({ show: true, type: "error", message });
  const notifyInfo = (message: string) =>
    setToast({ show: true, type: "info", message });

  const value = {
    alertModal,
    setAlertModal,
    toast,
    setToast,
    notifySuccess,
    notifyError,
    notifyInfo,
    screenLoadingStatus,
    setScreenLoadingStatus,
    isAuthenticated,
    setIsAuthenticated,
    isShowMobileMenu,
    setIsShowMobileMenu,
    referralCode,
    setReferralCode,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// Custom hook for using the GlobalContext
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

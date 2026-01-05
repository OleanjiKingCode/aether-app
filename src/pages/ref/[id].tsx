import { useEffect } from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context/GlobalContext";

const ReferralRedirect = () => {
  const router = useRouter();
  const { id } = router.query;
  const { setToast, setReferralCode } = useGlobalContext();

  useEffect(() => {
    if (id && typeof id === "string") {
      // Store referral code in localStorage
      localStorage.setItem("aether_referral_code", id);

      // Update context state
      setReferralCode(id);

      // Show toast notification
      setToast({
        message: `Referred by ${id}`,
        type: "success",
        show: true,
      });

      // Redirect to home page
      router.push("/");
    }
  }, [id, router, setToast]);

  // Show a loading state while redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#010314] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BB3EFF] border-t-transparent"></div>
        <p className="font-geist-mono text-sm text-[var(--theme-muted-foreground)]">
          Redirecting to AetherDex...
        </p>
      </div>
    </div>
  );
};

export default ReferralRedirect;

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/store/store";

const ReferrerHandler = () => {
  const searchParams = useSearchParams();
  const { setOnboardingPayload, onboardingPayload } = useStore();
  const referredByID = searchParams.get("referralid");

  useEffect(() => {
    if (referredByID && !onboardingPayload.referralCode) {
      // Only set if referral code is not already set to avoid overwriting user input
      setOnboardingPayload({
        ...onboardingPayload,
        referralCode: referredByID,
      });
      console.log("Referral code set from URL:", referredByID);
    }
  }, [referredByID, setOnboardingPayload, onboardingPayload]);

  return null;
};

export default ReferrerHandler;

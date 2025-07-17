"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ReferrerHandlerProps {
  referrer: string | null;
  setReferrer: (referrer: string) => void;
}

const ReferrerHandler = ({ referrer, setReferrer }: ReferrerHandlerProps) => {
  const searchParams = useSearchParams();
  const referredByID = searchParams.get("referralid");
  console.log("referredByID", referredByID == referrer ? "same" : "different", referrer, referredByID);

  useEffect(() => {
    if (referredByID) {
      setReferrer(referredByID);
    }
  }, [referredByID, setReferrer]);

  return null;
};

export default ReferrerHandler;

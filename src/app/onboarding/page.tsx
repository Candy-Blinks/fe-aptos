"use client";
import ProgressBar from "@/components/progress-bar";
// import { useAccount } from "wagmi";
// import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, Suspense, useState } from "react"; // Added Suspense
// import Link from "next/link";
import ReferrerHandler from "@/components/referrer-handler";
import { useStore } from "@/store/store";
import ChooseUsername from "@/views/onboarding/choose-username";
import ReferralCode from "@/views/onboarding/referral-code";
// import Disclaimer from "@/views/onboarding/disclaimer";
import Welcome from "@/views/onboarding/welcome";
import Link from "next/link";
import { ASSETS_URL } from "@/lib/constants";
import Image from "next/image";
import UploadProfile from "@/views/onboarding/upload-profile";
import ConnectWallet from "@/views/onboarding/connect-wallet";

export default function Page() {
  // const { address, isConnected } = useAccount();
  // const { openConnectModal } = useConnectModal();
  // const [currentStepId, setCurrentStepId] = useState<number>(1);
  // const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false);
  // const [username, setUsername] = useState<string>("");
  const [referrer, setReferrer] = useState<string>("");
  // const [isReferralValid, setIsReferralValid] = useState<boolean>(false); // Track if referral code is validated
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const {} = useStore();



  // const onboardingSteps = [
  //   { id: 1, step: "connect-wallet" },
  //   { id: 2, step: "choose-username" },
  //   { id: 3, step: "add-image" },
  //   { id: 4, step: "use-ref-code" },
  //   { id: 5, step: "disclaimer" },
  //   { id: 6, step: "welcome" },
  // ];

  // useEffect(() => {
  //   if (isConnected && !completedSteps.includes(1)) {
  //     // setCompletedSteps([1]);
  //     // setCurrentStepId(2);
  //   }
  // }, [isConnected]);

  const { onboardingPageNumber } = useStore();

  useEffect(() => {
    return () => {

    };
  }, []);

  return (
    <>

        <div className="top-0 w-full flex items-center justify-center p-4 mb-10 bg-black">
            <div className="flex items-center justify-between gap-4">
              <Link href={"/"} className="flex items-center justify-center gap-2">
                <Image
                  src={`${ASSETS_URL}logo.png`}
                  alt="logo"
                  width={90}
                  height={54}
                  className="cursor-pointer"
                />
    
                <span className="md:text-[50px] text-pink-32 font-semibold dm-sans">
                  CandyBlinks
                </span>
              </Link>
            </div>
        </div>

      <div
        className="flex w-full items-center justify-center"
        style={{ height: "100%" }}
      >
        <div className="flex h-full w-full max-w-[1440px] flex-col items-center justify-start gap-8 p-8">
          <div className="flex h-[474px] basis-[70%] items-center justify-center gap-4 rounded-md p-4">
            <div id="container" className="flex w-[608px] flex-col gap-8">
              <Suspense fallback={<div>Loading...</div>}>
                <ReferrerHandler referrer={referrer} setReferrer={setReferrer} />
              </Suspense>

              <ProgressBar steps={5} currentStep={onboardingPageNumber+1} />

              {onboardingPageNumber == 0 && <ConnectWallet />}
              {onboardingPageNumber == 1 && <ChooseUsername />}
              {onboardingPageNumber == 2 && <UploadProfile />}
              {onboardingPageNumber == 3 && <ReferralCode />}
              {onboardingPageNumber == 4 && <Welcome />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

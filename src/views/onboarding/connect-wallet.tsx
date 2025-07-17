"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ConnectWallet() {
  const { account, connected, disconnect, connect, wallets } = useWallet();

  const [isAddressValidated, setIsAddressValidated] = useState(false);

  const {
    setOnboardingPageNumber,
    onboardingPageNumber,
    setOnboardingPayload,
  } = useStore();

  // const { data: user, isSuccess: userIsSuccess } = useQuery({
  //   queryFn: async () => {
  //     const {
  //       data: { data },
  //     } = await axios.get(`${API_URL}users/address/${account?.address?.toString()}`);

  //     console.log(data);

  //     return data;
  //   },
  //   queryKey: ["address", account?.address?.toString()],
  //   enabled: !!account?.address,
  // });

  useEffect(() => {
    // if (userIsSuccess && user?.length === 0 && account?.address) {
    if (account?.address && !isAddressValidated) {
      setOnboardingPayload({
        address: account.address.toString(),
        referralCode: undefined,
        profilePic: "",
        username: "",
      });
      setIsAddressValidated(true);
    }
  }, [account?.address, setOnboardingPayload, isAddressValidated]);

  const handleConnectClick = async () => {
    try {
      if (connected) {
        await disconnect();
      } else {
        // For Aptos, try to connect to available wallets
        // Priority: Petra, Martian, Pontem, then any other available wallet
        const preferredWallets = ['Petra', 'Martian', 'Pontem'];
        let targetWallet = null;

        // First try preferred wallets
        for (const preferred of preferredWallets) {
          targetWallet = wallets?.find(w => w.name.includes(preferred));
          if (targetWallet) break;
        }

        // If no preferred wallet found, use the first available
        if (!targetWallet && wallets && wallets.length > 0) {
          targetWallet = wallets[0];
        }

        if (targetWallet) {
          await connect(targetWallet.name);
        } else {
          console.error("No Aptos wallets available. Please install Petra, Martian, or another Aptos wallet.");
          // You could show a toast or modal here directing users to install a wallet
        }
      }
    } catch (error) {
      console.error("Failed to connect/disconnect wallet:", error);
      // You could show an error toast here
    }
  };

  return (
    <>
      <p className="font-semibold text-[39px] text-center uppercase text-white-80">
        Connect Wallet
      </p>
      <div className="w-full">
        {/* <Button ref={walletButtonRef} className="hidden"> */}
          {/* <WalletMultiButton ref={walletButtonRef} className="hidden"/> */}
        {/* </Button> */}
        <Button
          onClick={handleConnectClick}
          className={cn(
            "font-semibold text-[31px] h-[82px] w-full  text-black-100 hover:bg-white-80",
            {
              "bg-white-50": !connected,
              "bg-white-100": connected,
            }
          )}
        >
          {!connected
            ? "CONNECT WALLET"
            : `${account?.address?.toString()?.slice(0, 6)}…${account?.address?.toString()?.slice(-4)}`}
        </Button>
        <div className="h-[34px] w-full pt-[12px]">
          {!connected ? (
            <p className="text-start text-pink-16">
              Connect your wallet to proceed!
            </p>
          ) : (
            <p className="text-start text-pink-16">Wallet Connected!</p>
          )}
        </div>
      </div>
      <Button
        disabled={!account?.address}
        onClick={() => {
          setOnboardingPageNumber(onboardingPageNumber + 1);
        }}
        className={cn(
          "text-[20px] uppercase font-semibold h-[82px] w-full bg-pink-50 text-white-100 hover:bg-pink-80 border border-pink-50"
        )}
      >
        Continue
      </Button>
    </>
  );
}

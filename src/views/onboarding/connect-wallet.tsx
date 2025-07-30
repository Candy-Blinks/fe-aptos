"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";

interface CheckAptosAddressResponse {
  available: boolean;
  message: string;
}

// Helper function to properly join URL paths
const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default function ConnectWallet() {
  const { account, connected, disconnect, connect, wallets } = useWallet();

  const [isAddressValidated, setIsAddressValidated] = useState(false);
  const [addressAlreadyRegistered, setAddressAlreadyRegistered] = useState(false);

  const {
    setOnboardingPageNumber,
    onboardingPageNumber,
    setOnboardingPayload,
  } = useStore();

  // Check if the connected address is already registered
  const { data: addressData, isLoading: isCheckingAvailability, error: availabilityError } = useQuery({
    queryFn: async (): Promise<CheckAptosAddressResponse> => {
      const { data } = await axios.get(joinUrl(API_URL, '/api/users/check-aptos-address'), {
        params: {
          aptos_address: account?.address?.toString(),
        },
        headers: {
          'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
        },
      });
      return data;
    },
    queryKey: ["checkAptosAddress", account?.address?.toString()],
    enabled: !!account?.address && connected,
    retry: false,
  });

  useEffect(() => {
    if (addressData && account?.address) {
      if (!addressData.available) {
        setAddressAlreadyRegistered(true);
        toast.error("This Aptos address is already registered. Please use a different wallet or sign in to your existing account.");
      } else {
        setAddressAlreadyRegistered(false);
        if (!isAddressValidated) {
          setOnboardingPayload({
            address: account.address.toString(),
            referralCode: undefined,
            profilePic: "",
            username: "",
          });
          setIsAddressValidated(true);
          toast.success("Wallet connected! You can proceed with registration.");
        }
      }
    }
  }, [addressData, account?.address, setOnboardingPayload, isAddressValidated]);

  useEffect(() => {
    if (availabilityError) {
      console.error("Error checking address availability:", availabilityError);
      toast.error("Failed to verify address. Please try again.");
    }
  }, [availabilityError]);

  // Reset states when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setIsAddressValidated(false);
      setAddressAlreadyRegistered(false);
    }
  }, [connected]);

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
          toast.error("No Aptos wallets available. Please install Petra, Martian, or another Aptos wallet.");
        }
      }
    } catch (error) {
      console.error("Failed to connect/disconnect wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <>
      <p className="font-semibold text-[39px] text-center uppercase text-white-80">
        Connect Wallet
      </p>
      <div className="w-full">
        <Button
          onClick={handleConnectClick}
          className={cn(
            "font-semibold text-[31px] h-[82px] w-full  text-black-100 hover:bg-white-80",
            {
              "bg-white-50": !connected,
              "bg-white-100": connected && !addressAlreadyRegistered,
              "bg-red-500": connected && addressAlreadyRegistered,
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
          ) : isCheckingAvailability ? (
            <p className="text-start text-yellow-400">
              Verifying address...
            </p>
          ) : addressAlreadyRegistered ? (
            <p className="text-start text-red-400">
              Address already registered!
            </p>
          ) : (
            <p className="text-start text-green-400">
              Wallet Connected & Verified!
            </p>
          )}
        </div>
      </div>
      <Button
        disabled={!account?.address || isCheckingAvailability || addressAlreadyRegistered}
        onClick={() => {
          setOnboardingPageNumber(onboardingPageNumber + 1);
        }}
        className={cn(
          "text-[20px] uppercase font-semibold h-[82px] w-full text-white-100 hover:bg-pink-80 border border-pink-50",
          {
            "bg-pink-50": !account?.address || isCheckingAvailability || addressAlreadyRegistered,
            "bg-pink-100": account?.address && !isCheckingAvailability && !addressAlreadyRegistered,
          }
        )}
      >
        {isCheckingAvailability ? "Verifying..." : "Continue"}
      </Button>
    </>
  );
}

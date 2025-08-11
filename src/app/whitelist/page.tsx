"use client";

import Navbar from "@/components/navbar";
import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import Image from "next/image";
import { ASSETS_URL } from "@/lib/constants";
import Footer from "@/components/footer";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ConnectWalletDialog } from "@/components/connect-wallet"; // Adjust the import path as needed

export default function WalletToSheets() {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { account } = useWallet();

  const closeDialog = () => setIsDialogOpen(false);

  const handleConnectClick = () => {
    setIsDialogOpen(true);
  };

  const handleSaveWallet = async (): Promise<void> => {
    if (!account) {
      toast.error("Please connect your wallet first.", {
        style: {
          background: "#1a1b24",
          color: "white",
          border: "1px solid #2a2a42",
        },
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: account.address.toString() }),
      });

      const data: { exists: boolean } = await response.json();
      if (data.exists) {
        toast.error("You have already added your wallet.", {
          style: {
            background: "#1a1b24",
            color: "white",
            border: "1px solid #2a2a42",
          },
        });
      } else {
        toast.success("Wallet successfully added!", {
          style: {
            background: "#1a1b24",
            color: "white",
            border: "1px solid #2a2a42",
          },
        });
      }
    } catch (error) {
      console.error("Error saving wallet:", error);
      toast.error("Error saving wallet. Try again.", {
        style: {
          background: "#1a1b24",
          color: "white",
          border: "1px solid #2a2a42",
        },
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="hidden" />
        </DialogTrigger>
        <ConnectWalletDialog close={closeDialog} />
      </Dialog>

      <div className="min-h-[calc(100vh-100px)] max-w-[1440px] mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-center gap-16 text-white">
        {/* Left side - Main Image */}
        <div className="w-full md:w-[40%]">
          <div className="rounded-lg overflow-hidden relative aspect-square">
            <Image
              src={`${ASSETS_URL}cmb2/${activeImage}.PNG`}
              alt="Candy Mob Boss NFT"
              width={500}
              height={500}
              className="rounded-lg w-full h-auto"
              priority
            />
          </div>

          {/* Thumbnail images - positioned below main image */}
          <div className="flex space-x-4 mt-8">
            {[2, 3, 4].map((imgNum) => (
              <div
                key={imgNum}
                className="w-1/3 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setActiveImage(imgNum)}
              >
                <Image
                  src={`${ASSETS_URL}cmb2/${imgNum}.PNG`}
                  alt={`NFT Thumbnail ${imgNum}`}
                  width={150}
                  height={150}
                  className={`w-full h-auto rounded-lg ${
                    activeImage === imgNum ? "ring-2 ring-[#ff6b6b]" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Text and button */}
        <div className="w-full md:w-[45%] flex flex-col md:pt-12 items-start justify-center">
          <p className="text-4xl md:text-[44px] font-bold leading-tight">
            Candy Move Business
          </p>
          <p className="text-xl md:text-2xl font-semibold mt-6">
            Be one of the first to OWN a Candy Move Boss.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed mt-3">
            On Mint, claim your exclusive Candy Move Business NFT. Each NFT
            unlocks unique perks and status in the Candy underworld. Only a
            select few will make it to the top. Will it be you?
          </p>

          <button
            onClick={account?.address.toString() ? handleSaveWallet : handleConnectClick}
            className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold py-2 px-2 text-xl rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : account?.address.toString()
              ? "Join Whitelist"
              : "Connect Wallet"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
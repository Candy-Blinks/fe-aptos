"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";
import { WalletSelector } from "./WalletSelector";
import { ASSETS_URL } from "@/constants";

export default function NoWallet() {
  // You can replace this with your actual image path

  return (
    <div className="min-h-screen bg-black-100 flex flex-col">
      <Navbar />

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0C0F18CC] z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src={`${ASSETS_URL}cmb_bg4.png`}
            alt="Background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="container relative z-20 flex flex-col items-center justify-center px-5 text-center max-w-2xl">
          <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-bold tracking-tight text-white">
            Oops!
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-300 mb-8 font-semibold">
            You can&apos;t access this page. Please connect your wallet first.
          </p>
          <div className="inline-block">
            <WalletSelector />
          </div>
        </div>
      </div>
    </div>
  );
}

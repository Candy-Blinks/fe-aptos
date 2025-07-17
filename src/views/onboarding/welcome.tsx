"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Welcome() {
  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <p className=" text-[39px] font-semibold text-center uppercase text-white-100">
          Welcome
        </p>
        <p className=" text-[20px] w-full px-8 font-semibold text-center text-white-50">
          Welcome to Candyblinks! The easiest way to mint your NFTs—no coding
          required.
        </p>
        <p className=" text-[20px] w-full px-8 font-semibold text-center text-white-50">
          Simply customize, upload, and launch your collection in just a few
          clicks. Start minting now and bring your digital creations to life!
        </p>

        <Link
          href="/"
          className={cn(
            "flex items-center mt-4 justify-center rounded-[8px] text-[20px] uppercase font-semibold h-[82px] w-full text-white-100 hover:bg-pink-80 border border-pink-50 bg-pink-50"
          )}
        >
          To Home
        </Link>
      </div>
    </>
  );
}

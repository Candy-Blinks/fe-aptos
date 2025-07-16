"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";
import { ASSETS_URL } from "../lib/constants";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black-100 flex flex-col">
      <Navbar />

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0C0F18CC] z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image src={`${ASSETS_URL}cmb_bg2.png`} alt="Background" fill priority className="object-cover" />
        </div>

        {/* Content */}
        <div className="container relative z-20 flex flex-col items-center justify-center px-5 text-center max-w-2xl">
          <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-bold tracking-tight text-white">404</h1>
          <p className="mt-4 text-base md:text-lg text-gray-300 mb-8 font-semibold">
            The page you&apos;re looking for can&apos;t be found. It looks like you&apos;re trying to access a page that
            either has been deleted or never existed.
          </p>
          <Link href="/" className="px-8 py-3 text-white bg-red-800 hover:bg-red-700 rounded-md transition-colors ">
            <h4 className="font-bold">HOME PAGE</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}

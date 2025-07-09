"use client";

import Image from "next/image";
import React from "react";
import { ASSETS_URL } from "@/constants";
import Link from "next/link";
import { WalletSelector } from "./WalletSelector";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Navbar() {
   const pathname = usePathname();
   const isActive = (path: string) => pathname === path ? 'text-white-100 font-semibold' : 'text-white-50';

  type NavbarLink = {
    text: string;
    href: string;
  };

  const navbarlinks: NavbarLink[] = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Feed",
      href: "/feed",
    },
    {
      text: "Create",
      href: "/create",
    },
    {
      text: "Hub",
      href: "/hub",
    },
    {
      text: "Tools",
      href: "/tools",
    },
    {
      text: "Whitelist",
      href: "/whitelist",
    }
  ]
  return (
    <div className="sticky top-0 w-full flex items-center justify-center p-4 z-[40] bg-[#0C0F18]">
      <div className="w-full max-w-[1440px] flex items-center justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href={"/"} className="flex items-center justify-center gap-2">
            <Image
              src={`${ASSETS_URL}logo.png`}
              alt="logo"
              width={45}
              height={45}
              className="cursor-pointer"
            />

            <span className="ty-h6 text-pink-32 font-semibold dm-sans md:block hidden">
              CandyBlinks
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-center text-sm text-white-50 gap-4">
          
          {navbarlinks.map((link, i) => (
            <Link
            key={i}
              href={link.href}
              className={cn(
                `flex text-[18px] focus:font-semibold hover:text-white-100 justify-center items-center hover:text-white font-semibold transition-all  ${isActive(link.href)}`
              )}
            >
              <span>{link.text}</span>
            </Link>
          ))}
        </div>

        <WalletSelector />
      </div>
    </div>
  );
}

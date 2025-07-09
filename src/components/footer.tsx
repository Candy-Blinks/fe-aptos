import Image from "next/image";
import { ASSETS_URL } from "../constants";

import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center mt-10 p-4">
      <div className="w-full max-w-[1440px] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src={`${ASSETS_URL}logo.png`}
            alt="logo"
            width={40}
            height={40}
            className="cursor-pointer"
          />
          <span className="ty- text-pink-32 font-semibold dm-sans md:block hidden">
            CandyBlinks
          </span>
        </div>
        <p className={cn("ty-descriptions text-white-50")}>
          © Copyright 2025, All Rights Reserved by Sweet Studios
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://discord.gg/J2EhFv3u9N"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#FAFCFF14] p-2"
          >
            <Image
              src={`${ASSETS_URL}icons/discord-solid-rounded.svg`}
              alt="Discord"
              width={16}
              height={16}
            />
          </a>
          <a
            href="https://t.me/+ReCtrAQvBPkzNmQ9"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#FAFCFF14] p-2"
          >
            <Image
              src={`${ASSETS_URL}icons/telegram-solid-rounded.svg`}
              alt="Telegram"
              width={16}
              height={16}
            />
          </a>
          <a
            href="https://x.com/CandyBlinks_"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#FAFCFF14] p-2"
          >
            <Image
              src={`${ASSETS_URL}icons/new-twitter-solid-rounded.svg`}
              alt="Twitter"
              width={16}
              height={16}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

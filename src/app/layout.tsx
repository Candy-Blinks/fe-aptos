import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ReactQueryProvider } from "@/components/provider/react-query-provider";
import { WalletProvider } from "@/components/provider/wallet-provider";
import { Toaster } from "@/components/ui/sonner";
import { WrongNetworkAlert } from "@/components/wrong-network-alert";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const DM_Sans_init = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.METADATA_BASE_URL || ""),
  title: {
    default: "CandyBlinks | NFT Launchpad",
    template: "%s | CandyBlinks",
  },
  description:
    "Create and manage your NFT collections effortlessly with our intuitive platform. Simplify NFT distribution and minting with ease.",
  openGraph: {
    title: "CandyBlinks - NFT Launchpad",
    description: "Easily generate Candy Stores",
    siteName: "CandyBlinks",
    type: "website",
  },
  other: {
    "dscvr:canvas:version": "vNext",
    "og:image": "https://i.imgur.com/sMQhSGP.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
      className={`${geistSans.variable} ${geistMono.variable} ${DM_Sans_init.className} antialiased`}      
      >
        <WalletProvider>
          <ReactQueryProvider>
            <div id="root" className="min-h-[100vh] bg-black-80 z-0">{children}</div>
            <WrongNetworkAlert />
            <Toaster />
          </ReactQueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}

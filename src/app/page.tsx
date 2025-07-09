"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Navbar from "@/components/navbar"; 
import HeroSection from "@/components/hero-section";
import FeaturedCollection from "@/components/feature-collection";
import NewNftCollections from "@/components/new-nft-collections";
import AlmostMintedCollections from "@/components/almost-minted-collections";
import LeadingCreators from "@/components/leading-creators";
import ExploreCollections from "@/components/explore-collections";
import GetStarted from "@/components/get-started";
import Footer from "@/components/footer";

function App() {
  const { connected } = useWallet();

  return (
    <>
      {!connected && console.log("Wallet not connected")}
      <Navbar />
      <div className="w-full flex items-center justify-center mt-10">
        <div className="max-w-[1280px] w-full flex flex-col gap-32">
          <HeroSection />
          <FeaturedCollection />
          <NewNftCollections />
          <AlmostMintedCollections />
          <LeadingCreators />
          <ExploreCollections />
          <GetStarted />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;

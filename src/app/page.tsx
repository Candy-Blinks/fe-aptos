"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import Navbar from "@/components/navbar";
// import HeroSection from "@/views/hero-section";
// import FeaturedCollection from "@/views/feature-collection";
// import NewNftCollections from "@/views/new-nft-collections";
// import AlmostMintedCollections from "@/views/almost-minted-collections";
// import LeadingCreators from "@/views/leading-creators";
// import ExploreCollections from "@/views/explore-collections";
// import GetStarted from "@/views/get-started";
// import Footer from "@/components/footer";

function App() {
  const router = useRouter();
  // const { connected } = useWallet();

  useEffect(() => {
    // Force redirect when the page loads
    router.push("/whitelist");
  }, [router]);

  return (
    <>
      {/* {!connected && console.log("Wallet not connected")}
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
      <Footer /> */}
    </>
  );
}

export default App;

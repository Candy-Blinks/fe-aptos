"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GetStarted from "@/views/get-started";
//import useLaunchpadProgram from "@/hooks/programs/useLaunchpadProgram";
import CandyStoreCard from "@/views/new-collections/candy-store-card";
import { cn } from "@/lib/utils";
import useFetchAllCollections from "@/hooks/api/collection/useFetchAllCollections";
import { useEffect } from "react";

export default function Explore() {
  //const { fetchAllCandyStores } = useLaunchpadProgram();
  
  // Use the new hook to fetch all collections
  const { data: collections, isLoading, error } = useFetchAllCollections();

  // Console log the data
  useEffect(() => {
    if (collections) {
      console.log("Collections data:", collections);
    }
    if (error) {
      console.error("Error fetching collections:", error);
    }
  }, [collections, error]);

  // Mock data for now (you can replace this with real collections later)
  const fetchAllCandyStores = {
    data: [
      {
        address: "0x1234567890abcdef1234567890abcdef12345678",
        url: "https://example.com/metadata/collection1.json",
        numberOfItems: 10000,
        name: "Cyber Punks Collection",
        minted: 7500,
      },
      {
        address: "0x2345678901bcdef12345678901bcdef123456789",
        url: "https://example.com/metadata/collection2.json",
        numberOfItems: 5000,
        name: "Digital Art Gallery",
        minted: 3200,
      },
      {
        address: "0x3456789012cdef123456789012cdef1234567890",
        url: "https://example.com/metadata/collection3.json",
        numberOfItems: 8000,
        name: "Fantasy Creatures",
        minted: 6100,
      },
      {
        address: "0x456789013def1234567890123def12345678901",
        url: "https://example.com/metadata/collection4.json",
        numberOfItems: 3000,
        name: "Abstract Visions",
        minted: 1800,
      },
      {
        address: "0x56789014ef123456789014ef123456789012345",
        url: "https://example.com/metadata/collection5.json",
        numberOfItems: 12000,
        name: "Retro Gaming NFTs",
        minted: 9800,
      },
      {
        address: "0x6789015f1234567890156f1234567890123456",
        url: "https://example.com/metadata/collection6.json",
        numberOfItems: 6000,
        name: "Space Explorers",
        minted: 4500,
      },
    ]
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex items-center justify-center mt-10">
        <div className="max-w-[1280px] w-full flex flex-col gap-16">
          <div className="w-full flex items-center justify-center">
            <p className={cn("ty-h2 text-white-100")}>Explore Candy Stores</p>
          </div>

          {isLoading && (
            <div className="w-full flex items-center justify-center">
              <p className="text-white-100">Loading collections...</p>
            </div>
          )}

          {error && (
            <div className="w-full flex items-center justify-center">
              <p className="text-red-500">Error loading collections: {error.message}</p>
            </div>
          )}

          <div className="w-full flex flex-wrap gap-4">
            {fetchAllCandyStores?.map((candyStore: any) => {
              return (
                <div key={candyStore.address} className="basis-[24%]">
                  <CandyStoreCard
                    jsonUrl={candyStore.url}
                    // jsonUrl={candyStore.collection_uri}
                    publicKey={candyStore.address}
                    numberOfItems={candyStore.numberOfItems}
                    // numberOfItems={candyStore.max_supply}
                    name={candyStore.name}
                    // name={candyStore.collection_name}
                    minted={candyStore.minted}
                    // minted={candyStore.number_of_mints}

                  />
                </div>
              );
            })}
          </div>

          <GetStarted />
        </div>
      </div>
      <Footer />
    </>
  );
}

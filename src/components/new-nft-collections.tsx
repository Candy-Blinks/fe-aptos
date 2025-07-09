"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
//import useLaunchpadProgram from "@/hooks/programs/useLaunchpadProgram";
import CandyStoreCard from "@/components/candy-store-card";
import Link from "next/link";

export default function NewNftCollections() {
  //const { fetchAllCandyStores } = useLaunchpadProgram();

  // Mockup data for candy stores
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
    <div className="flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <p className={cn("ty-h4 text-white-100")}>New NFT Collections</p>

        <Link href="/new-collections">
          <p className={cn("ty-title text-white-50 underline")}>View All</p>
        </Link>
      </div>

      <Carousel>
        <CarouselContent>
          {fetchAllCandyStores.data?.map((candyStore: any) => {

            return (
              <CarouselItem key={candyStore.address} className="basis-1/4">
                <div className="p-2 -m-1">
                  <CandyStoreCard
                    jsonUrl={candyStore.url}
                    key={candyStore.address}
                    publicKey={candyStore.address}
                    numberOfItems={candyStore.numberOfItems}
                    name={candyStore.name}
                    minted={candyStore.minted}
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

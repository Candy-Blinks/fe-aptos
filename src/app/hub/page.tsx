"use client";
import React from "react";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useMount from "@/hooks/useMount";
import { ChevronDown, Search } from "lucide-react";
import useFetchOwnedCandyStores from "@/hooks/api/useFetchOwnedCandyStores";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
export default function Hub() {

  const { account } = useWallet();

  const { data: fetchMyCandyStores, isLoading, error } = useFetchOwnedCandyStores({
    accountAddress: account?.address.toStringLong(),
  });

  console.log('Candy store address:', account?.address.toStringLong());
  console.log('Collections data:', fetchMyCandyStores);
  console.log('Loading state:', isLoading);
  console.log('Error:', error);

  const mounted = useMount();

  if (!mounted) {
    return <></>;
  }
  return (
    <>
      <Navbar />
      <div className="w-full flex items-start justify-center min-h-dvh mt-10">
        <div className="max-w-[1280px] w-full flex flex-col gap-8">
          <div className="w-full flex justify-between items-center">
            <p className={cn("ty-h4")}>Creators Hub</p>

            <div className="flex items-center gap-2">
              <Button className={cn("bg-white-4")}>Create Collection</Button>
              {/* <Button className={cn("bg-pink-100")}>Delete</Button> */}
            </div>
          </div>

          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-4 bg-white-4 p-2 rounded-lg">
              <p
                className={cn(
                  "ty-subtitle text-white-50 bg-pink-100 p-1 rounded"
                )}
              >
                All
              </p>
              <p className={cn("ty-subtitle text-white-50 p-1 rounded")}>
                Fully Minted
              </p>
              <p className={cn("ty-subtitle text-white-50 p-1 rounded")}>
                Not Fully Minted
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className={cn("bg-white-4")}>
                    Sort By <ChevronDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  Place content for the popover here.
                </PopoverContent>
              </Popover>
              <div className="max-w-[150px] flex items-center gap-1 bg-white-4 shadow-lg rounded-lg border border-white-4 py-1 px-2">
                <Search size={16} />

                <Input
                  className={cn(
                    "w-full h-full placeholder:ty-descriptions text-white-32 bg-transparent"
                  )}
                  placeholder="Search by name"
                />
              </div>
            </div>
          </div>

            <div className="flex flex-wrap gap-2">
            {Array.isArray(fetchMyCandyStores) && fetchMyCandyStores.length > 0 ? (
                fetchMyCandyStores.map((collection: any) => (
                <CandyStoreCard
                    key={`${collection.collection_owner}-${collection.collection_name}`}
                    jsonUrl={collection.collection_uri}
                    publicKey={collection.collection_owner}
                    name={collection.collection_name}
                    minted={collection.number_of_mints}
                    numberOfItems={collection.max_supply}
                    description={collection.collection_description}
                />
                ))
            ) : isLoading ? (
                <p className="text-white-50">Loading...</p>
            ) : (
                <p className="text-white-50">No collections found.</p>
            )}
            </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
interface ICandyStoreCardProps {
  jsonUrl: string;
  publicKey: string;
  name: string;
  minted: string; // Changed from number to string since API returns string
  numberOfItems: string; // Changed from number to string since API returns string
  description?: string;
}

function CandyStoreCard({
  jsonUrl,
  publicKey,
  name,
  minted,
  numberOfItems,
  description,
}: ICandyStoreCardProps) {
  const { data } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(jsonUrl);
      return data;
    },
    queryKey: ["collection-json", jsonUrl],
  });

  if (!data?.image) {
    return null;
  }

  const rawMintPercentage = (Number(minted) / Number(numberOfItems)) * 100;
  const mintPercentage =
    rawMintPercentage % 1 === 0
      ? rawMintPercentage.toFixed(0)
      : rawMintPercentage.toFixed(2);

  return (
    <Link
      href={`/hub/${publicKey}/${name}`}
      className="p-3 basis-[19.50%] gap-2 bg-white-4 rounded-lg shadow-lg flex flex-col w-fit items-center cursor-pointer hover:ring-1 hover:ring-[#682F2F] transition duration-200 ease-in-out"
    >
      <div className="h-[180px] w-[180px] bg-red-200 rounded-2xl relative">
        <Image
          src={data?.image}
          alt={name}
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className={cn("ty-title")}>{name}</div>
        <div className={cn("ty-subtitle text-white-80")}>{data?.symbol}</div>
        <Progress value={rawMintPercentage} />

        <div className="flex justify-between">
          <p className={cn("ty-subtext text-white-80")}>
            {mintPercentage}% Minted
          </p>
          <p className={cn("ty-subtext text-white-50")}>
            ({Number(minted)}/{Number(numberOfItems)})
          </p>
        </div>
      </div>
    </Link>
  );
}
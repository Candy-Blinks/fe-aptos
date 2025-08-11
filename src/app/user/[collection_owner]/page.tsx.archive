"use client";
import React, { useEffect, useState } from "react";

import Navbar from "@/components/navbar";
import Image from "next/image";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Globe, Search, Twitter, Users } from "lucide-react";

import Footer from "@/components/footer";
import useFetchOwnedCandyStores from "@/hooks/api/useFetchOwnedCandyStores";
import useFetchMetadata from "@/hooks/useFetchMetadata";
import Link from "next/link";
import PhaseEditorDialog from "@/views/hub/phase-editor-dialog";
import { useStore } from "@/store/store";
// import useFetchUserTransactions from "@/hooks/programs/useFetchUserTransactions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Progress } from "@/components/ui/progress";

interface StoreProps {
  params: {
    collection_owner: string;
  };
}

export default function User({ params }: StoreProps) {
  const { collection_owner } = params;

  const { data: fetchMyCandyStores, isLoading } = useFetchOwnedCandyStores({
    accountAddress: collection_owner,
  });

  const { setHubPhases } = useStore();

  const [openPhaseEditor, setOpenPhaseEditor] = useState(false);

  return (
    <>
      <div className="mb-10">
        <Navbar />
      </div>
      <PhaseEditorDialog
        open={openPhaseEditor}
        onOpenChange={setOpenPhaseEditor}
      />
      <div className="w-full flex items-start justify-center min-h-dvh mt-10">
        <div className="max-w-[1280px] w-full flex flex-col gap-8">
          <div className="w-full bg-white-4 border border-white-8 p-8 rounded-xl flex flex-col gap-8">
            <div className="w-full max-h-[196px] h-[196px] bg-white-8 rounded-3xl relative">
              <Image
                src={"/images/banner.jpeg"}
                alt={"/images/banner.jpeg"}
                fill
                className="object-cover rounded-2xl "
              ></Image>
            </div>
            {/* DETAILS */}

            <div className="flex justify-between gap-16">
              <div className="basis-[50%] flex flex-col gap-8">
                <div className="flex gap-4 relative">
                  <div className="w-[150px] h-[150px] bg-red-50 absolute bottom-0 left-0 rounded-2xl ">
                    <div className="h-full w-full relative">
                      <Image
                        src={
                          fetchMyCandyStores?.image
                            ? fetchMyCandyStores?.image
                            : "/images/cmb/collection.png"
                        }
                        alt={
                          fetchMyCandyStores?.image
                            ? fetchMyCandyStores?.image
                            : "/images/cmb/collection.png"
                        }
                        fill
                        className="object-cover rounded-2xl "
                      />
                    </div>
                  </div>
                  <div className="w-[200px]"></div>

                  <div className="w-full flex justify-between">
                    <div className="flex flex-col gap-2">
                      <p className={cn("ty-h6 text-white-100")}>
                        {fetchMyCandyStores?.collection_name ? fetchMyCandyStores?.collection_name : "Undefined"}
                      </p>
                      <p className={cn("ty-subheading text-white-50")}>
                        {fetchMyCandyStores?.symbol
                          ? fetchMyCandyStores?.symbol
                          : "Undefined"}
                      </p>
                    </div>

                    <Button>Follow</Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className={cn("ty-subtitle text-white-100")}>Bio</p>

                    {/* <Button className="flex items-center gap-4">
                      <Pencil size={5} />
                      <p className={cn("ty-title text-white-80")}>Edit</p>
                    </Button> */}
                  </div>
                  <p className={cn("ty-descriptions text-white-50")}>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Eum sit exercitationem repellendus earum reprehenderit fuga
                    officiis facere, modi molestiae tenetur aliquam? Tenetur,
                    amet a aperiam eius quia dolorum assumenda provident!
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex gap-2">
                    <div className="p-2">
                      <Globe size={16} />
                    </div>
                    <div className="flex flex-col">
                      <p className={cn("ty-subtitle text-white-50")}>Website</p>
                      {fetchMyCandyStores?.website && (
                        <Link href={fetchMyCandyStores?.website} target="_blank">
                          <p
                            className={cn(
                              "ty-descriptions text-white-100 underline"
                            )}
                          >
                            {fetchMyCandyStores?.website
                              ? fetchMyCandyStores?.website
                              : "Undefined"}
                          </p>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="p-2">
                      <Users size={16} />
                    </div>
                    <div className="flex flex-col">
                      <p className={cn("ty-subtitle text-white-50")}>
                        Socials and Community
                      </p>

                      <div className="flex items-center gap-4">
                        {fetchMyCandyStores?.x && (
                          <Link href={fetchMyCandyStores?.x} target="_blank">
                            <Twitter size={16} />
                          </Link>
                        )}

                        {fetchMyCandyStores?.ig && (
                          <Link href={fetchMyCandyStores?.ig} target="_blank">
                            <Twitter size={16} />
                          </Link>
                        )}

                        {fetchMyCandyStores?.tg && (
                          <Link href={fetchMyCandyStores?.tg} target="_blank">
                            <Twitter size={16} />
                          </Link>
                        )}

                        {fetchMyCandyStores?.discord && (
                          <Link href={fetchMyCandyStores?.discord} target="_blank">
                            <Twitter size={16} />
                          </Link>
                        )}

                        {fetchMyCandyStores?.yt && (
                          <Link href={fetchMyCandyStores?.yt} target="_blank">
                            <Twitter size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="basis-[50%] flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <div className="w-full rounded-3xl border border-white-4 flex flex-col gap-4 p-4">
                    <div className="flex w-full justify-between p-4 bg-white-16 rounded-xl">
                      <p className={cn("ty-descriptions text-white-100 ")}>
                        Multiplier
                      </p>
                      <p className={cn("ty-title text-white-100 ")}>0.5x</p>
                    </div>

                    <div className="flex w-full justify-between">
                      <p className={cn("ty-subtitle text-white-50 ")}>
                        Candy Stores Created
                      </p>
                      <p className={cn("ty-title text-white-100 ")}>5</p>
                    </div>

                    <div className="flex w-full justify-between">
                      <p className={cn("ty-subtitle text-white-50 ")}>
                        CMB Hold
                      </p>
                      <p className={cn("ty-title text-white-100 ")}>5</p>
                    </div>
                    <div className="flex w-full justify-between">
                      <p className={cn("ty-subtitle text-white-50 ")}>
                        Candy Store Mints
                      </p>
                      <p className={cn("ty-title text-white-100 ")}>36</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className={cn("ty-h4 text-white-100")}>John Doe’s Candy Store</p>
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
                  Minted
                </p>
                <p className={cn("ty-subtitle text-white-50 p-1 rounded")}>
                  Not Minted
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
      href={`/`}
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

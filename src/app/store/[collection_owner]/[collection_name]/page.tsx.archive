"use client";
import { Button } from "@/components/ui/button";
// import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Progress } from "@/components/ui/progress";

import Footer from "@/components/footer";
import { cn, truncateAddress } from "@/lib/utils";
import { useParams } from "next/navigation";
import useFetchMetadata from "@/hooks/useFetchMetadata";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useStore } from "@/store/store";
//import useLaunchpadProgram from "@/hooks/programs/useLaunchpadProgram";

// Aptos constants
const OCTAS_PER_APT = 100_000_000;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_INSTANCE } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RecentMintedAssets from "@/views/store/recent-minted-assets";
import { ASSETS_URL } from "@/lib/constants";
import { Countdown } from "@/components/countdown";
import WorldIcon from "@/components/icons/world";
import { Separator } from "@/components/ui/separator";
import useMintToken from "@/hooks/useMintToken";
import useFetchCollection from "@/hooks/api/useFetchCollection";

interface StoreProps {
  params: {
    collection_owner: string;
    collection_name: string;
  };
}

export default function Store({ params }: StoreProps) {
  const { collection_owner, collection_name } = params;

  const { data, isLoading, error } = useFetchCollection({
    collectionOwner: collection_owner,
    collectionName: collection_name,
  });

  const { mintPhases, setMintPhases, setMintCurrentPhase, mintCurrentPhase, mintTab, setMintTab } = useStore();

  const { account } = useWallet();

  const { mutateAsync: mintTokenMutation, isPending, isSuccess, isError } = useMintToken();

  // const { data: assets } = useQuery({
  //   queryFn: async () => {
  //     const {
  //       data: { data },
  //     } = await API_INSTANCE.get(`assets/collection/${candyStore?.collection}`);

  //     return data ?? [];
  //   },
  //   enabled: !!candyStore?.collection,
  //   queryKey: ["assets", candyStore?.collection],
  // });

  // const { data: comments } = useQuery({
  //   queryFn: async () => {
  //     const {
  //       data: { data },
  //     } = await API_INSTANCE.get(
  //       `candy-store-comments/candy-store/${candyStore?.address}`
  //     );

  //     return data ?? [];
  //   },
  //   enabled: !!candyStore?.address,
  //   queryKey: ["comments", candyStore?.address],
  // });

  // const queryClient = useQueryClient();
  // const [currentComment, setCurrentComment] = useState("");

  // const { mutate: comment } = useMutation({
  //   mutationFn: async ({ candyStore, user, data }: any) => {
  //     if (data.trim() != "") {
  //       await API_INSTANCE.post("candy-store-comments", {
  //         candyStore,
  //         user,
  //         data,
  //       });
  //     }
  //   },
  //   onSuccess: () => {
  //     setCurrentComment("");
  //     queryClient.invalidateQueries();
  //   },
  // });

  // const onComment = () => {
  //   comment({
  //     candyStore: candyStore?.address,
  //     user: account?.address?.toString(),
  //     data: currentComment,
  //   });
  // };

  // const { data: collectionMetadata } = useFetchMetadata({
  //   url: candyStore?.url ? `${candyStore?.url}/collection.json` : undefined,
  // });

  // useEffect(() => {
  //   console.log(candyStore);
  // }, [candyStore]);

  useEffect(() => {
    // Mock phases data
    const tempPhases = [
      {
        label: "Team",
        startDate: {
          timestamp: Math.floor((Date.now() + 5 * 7 * 24 * 60 * 60 * 1000) / 1000),
        },
        endDate: {
          timestamp: Math.floor((Date.now() + 7 * 7 * 24 * 60 * 60 * 1000) / 1000), // Convert to seconds
        },
        aptosPayment: {
          amount: 0, // Free for team
        },
        mintLimit: {
          limit: 5, // Max 5 per wallet
        },
        allocation: {
          limit: 100, // 100 NFTs allocated for team
        },
      },
      {
        label: "Whitelist",
        startDate: {
          timestamp: Math.floor((Date.now() + 1 * 7 * 24 * 60 * 60 * 1000) / 1000),
        },
        endDate: {
          timestamp: Math.floor((Date.now() + 2 * 7 * 24 * 60 * 60 * 1000) / 1000), // Convert to seconds
        },
        aptosPayment: {
          amount: 1.5 * OCTAS_PER_APT, // 1.5 APT
        },
        mintLimit: {
          limit: 3, // Max 3 per wallet
        },
        allocation: {
          limit: 500, // 500 NFTs allocated for whitelist
        },
      },
      {
        label: "Public",
        startDate: {
          timestamp: Math.floor((Date.now() + 4 * 7 * 24 * 60 * 60 * 1000) / 1000),
        },
        endDate: {
          timestamp: Math.floor((Date.now() + 8 * 7 * 24 * 60 * 60 * 1000) / 1000), // Convert to seconds
        },
        aptosPayment: {
          amount: 2.5 * OCTAS_PER_APT, // 2.5 APT
        },
        mintLimit: {
          limit: 10, // Max 10 per wallet
        },
        allocation: {
          limit: 940, // Remaining NFTs for public
        },
      },
    ];

    // Use mock data instead of candyStore?.phases
    // const tempPhases = candyStore?.phases ?? [];

    if (tempPhases.length > 0) {
      setMintPhases(tempPhases);
      setMintCurrentPhase(tempPhases?.[0]?.label);
    }
  }, [setMintPhases, setMintCurrentPhase]);

  // interface IMintArgs {
  //   signers: {
  //     asset: Keypair;
  //   };
  //   accounts: {
  //     collection: PublicKey;
  //     candyStore: PublicKey;
  //     solPaymentUser?: PublicKey;
  //     settings: PublicKey;
  //     treasuryWallet: PublicKey;
  //     minter?: PublicKey;
  //   };
  //   args: {
  //     label: string;
  //   };
  // }

  const onMint = async () => {
    // TODO: Implement Aptos minting functionality
    // In Aptos, you would typically call a Move function instead of generating keypairs
    console.log("Minting with current phase:", mintCurrentPhase);

    if (!account) return;

    console.log(data);

    try {
      const { mintTransactionHash } = await mintTokenMutation({
        collectionOwner: data?.collection_owner,
        collectionName: data?.collection_name,
        tokenName: data?.token_name,
        tokenDescription: data?.token_description,
        tokenURI: `${data?.token_uri}`,
      });
      console.log(`Transaction succeeded, hash: ${mintTransactionHash}`);
    } catch (error) {
      console.error(error);
    }
  };

  const phaseStatusDisplay = (phase: any) => {
    const currentDate = new Date();
    const startDate = new Date(phase?.startDate?.timestamp);
    const endDate = new Date(phase?.endDate?.timestamp);

    let status = "";

    if (currentDate < startDate) {
      status = "UPCOMING";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      status = "LIVE";
    } else if (currentDate > endDate) {
      status = "ENDED";
    }

    switch (status) {
      case "LIVE":
        return (
          <div className="flex gap-2 items-center">
            <div className="size-[16px]">
              <Image
                src={`${ASSETS_URL}icons/phase-live.svg`}
                width={16}
                height={16}
                alt="live icon"
                className="bg-text-100"
              />
            </div>
            <span className="text-pink-32 font-medium text-[16px]">LIVE</span>
          </div>
        );
      case "UPCOMING":
        return (
          <div className="flex gap-2 items-center">
            <div className="size-[16px]">
              <Image
                src={`${ASSETS_URL}icons/phase-upcoming.svg`}
                width={16}
                height={16}
                alt="live icon"
                className="bg-text-100"
              />
            </div>
            <span className="text-white-16 font-medium text-[16px]">UPCOMING</span>
          </div>
        );
      case "ENDED":
        return (
          <div className="flex gap-2 items-center">
            <div className="size-[16px]">
              <Image
                src={`${ASSETS_URL}icons/phase-ended.svg`}
                width={16}
                height={16}
                alt="live icon"
                className="bg-text-100"
              />
            </div>
            <span className="text-pink-32 font-medium text-[16px]">ENDED</span>
          </div>
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    // TODO: Implement error handling for Aptos minting
    // console.log(mintAsset?.error);
  }, []);

  if (isLoading) return <p>Loading collection...</p>;
  if (error) return <p>{(error as Error).message}</p>;

  return (
    <>
      <Navbar />

      <div className="w-full flex items-center justify-center mt-10">
        <div className="max-w-[1280px] w-full flex flex-col gap-32">
          <div className="w-full flex flex-col gap-16 items-center">
            <div className="w-full flex justify-center gap-8">
              <div className="basis-[50%] max-w-[500px] gap-[10px] flex flex-col items-center">
                <div className="w-full flex items-center justify-center">
                  <div className="size-[500px]  rounded-3xl relative">
                    <Image
                      src={
                        // collectionMetadata?.image
                        //   ? collectionMetadata?.image
                        //   :
                        `${ASSETS_URL}/candyblinks.png`
                      }
                      alt="Collection Image"
                      fill
                      className="object-cover rounded-2xl"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-[10px] justify-between w-full">
                  {Array.from({ length: 3 }, (_, i) => i + 1).map((value) => {
                    return (
                      <NftImage
                        className="size-[160px] hover:scale-105 transition duration-200 ease-in-out"
                        jsonUrl={data?.collection_url}
                        key={value}
                        number={value - 1}
                      />
                    );
                  })}
                </div> 
              </div>
              <div className="basis-[50%] max-w-[500px] flex flex-col gap-4">
                <p className={cn("ty-h3 text-white-100")}>Candy Mob Business</p>
                <div className="flex items-center gap-4 bg-white-4 p-2 rounded-lg w-fit">
                  <Button
                    className={cn(
                      "ty-subtitle font-semibold bg-transparent hover:bg-pink-100 text-white-50 px-2 py-1 rounded transition ease-in-out duration-200",
                      mintTab === 0 && "bg-pink-100 text-white-100",
                    )}
                    onClick={() => setMintTab(0)}
                  >
                    Phases
                  </Button>
                  <Button
                    className={cn(
                      "ty-subtitle font-semibold hover:bg-pink-100 bg-transparent text-white-50 px-2 py-1 rounded transition ease-in-out duration-200",
                      mintTab === 1 && "bg-pink-100 text-white-100",
                    )}
                    onClick={() => setMintTab(1)}
                  >
                    About
                  </Button>
                </div>

                {mintTab === 0 && (
                  <div className="w-full flex flex-col gap-2">
                    {mintPhases?.map((phase: any) => {
                      return (
                        <div
                          key={phase.label}
                          onClick={() => {
                            setMintCurrentPhase(phase.label);
                          }}
                          className={cn(
                            "w-full p-4 flex flex-col gap-2 rounded-lg bg-white-4 border border-white-4 cursor-pointer transition ease-in-out duration-200",
                            mintCurrentPhase == phase.label ? "border border-[#682F2F]" : "",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <p className={cn("text-[18px] font-semibold text-white-100")}>{phase.label}</p>
                            <div>{phaseStatusDisplay(phase)}</div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                              <div className="size-[20px]">
                                <Image
                                  src={`${ASSETS_URL}icons/clock-04.svg`}
                                  width={20}
                                  height={20}
                                  alt="clock icon"
                                  className="bg-text-100"
                                />
                              </div>
                              <span className="font-semibold text-[18px]">
                                {phase.startDate?.timestamp && <Countdown unixTimestamp={phase.startDate?.timestamp} />}
                              </span>
                            </div>

                            <p className={cn("ty-subtext text-white-100 text-[18px]")}>
                                {phase.aptosPayment && phase.aptosPayment.amount > 0 ? `${phase.aptosPayment.amount / OCTAS_PER_APT} APT` : "FREE"}
                            </p>
                          </div>
                          <div className="w-full">
                            <Progress
                              className=" w-full h-[8px] bg-[#FAFCFF80]"
                              value={(data?.number_of_mints ?? 0 / data?.max_supply ?? 0) * 10}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <p
                              className={cn(
                                "text-[14px] font-medium text-white-100"
                              )}
                            >
                              {phase.allocation
                                ? `${
                                    (data?.number_of_mints ??
                                      0 / phase.allocation.limit ??
                                      0) * 10
                                  }% Minted`
                                : ""}
                            </p>
                            <p
                              className={cn(
                                "text-[14px] font-medium text-[#FAFCFF80]"
                              )}
                            >
                              {phase.allocation
                                ? `${data?.number_of_mints}/${phase.allocation.limit}`
                                : ""}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className={cn("text-[14px] font-medium text-white-50")}>
                              {phase.mintLimit ? `Max mint: ${phase.mintLimit.limit} per wallet` : ""}
                            </p>
                          </div>
                          <div className="flex items-center justify-between"></div>
                        </div>
                      );
                    })}

                    <div className="w-full p-4 flex flex-col gap-2 rounded-lg bg-white-4 border border-white-4 cursor-pointer transition ease-in-out duration-200">
                      <Button
                        onClick={onMint}
                        className="my-3 w-full text-xl bg-red-400 hover:bg-red-500 text-white dm-sans font-bold py-2 px-4 rounded transition-colors duration-200 hover:shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-400"
                      >
                        Mint
                      </Button>
                    </div>
                  </div>
                )}

                {mintTab === 1 && (
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full text-[18px] p-4 flex flex-col gap-4 rounded-lg bg-white-4 border border-white-4 transition ease-in-out duration-200">
                      <a
                        href="https://candy-mob.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F4FAFD80] flex items-center justify-start gap-2"
                      >
                        <WorldIcon />
                        <p className="text-white-100 underline">
                          https://candy-mob.com
                        </p>
                      </a>
                      <Separator className="bg-[#FAFCFF0A]" />
                      <div>
                        <p className="text-[#FAFCFF80]">Supply</p>
                        <p className="text-white-100 ">{data?.max_supply}</p>
                      </div>
                      <Separator className="bg-[#FAFCFF0A]" />
                      <p className="text-white-100 ">{data?.collection_description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between">
              <p className={cn("ty-h4 text-white-100")}>Recently minted NFTs</p>
            </div>

            {/* <div className="w-full flex flex-row gap-2">
              {assets &&
                Array.isArray(assets) &&
                assets.length > 0 &&
                Array.from(
                  { length: Math.min(6, assets.length) },
                  (_, i) => i + 1
                ).map((value) => {
                  const asset = assets[value - 1];
                  return (
                    asset && (
                      <RecentMintedAssets
                        key={asset?.address}
                        metadata={asset?.metadata}
                      />
                    )
                  );
                })}
            </div> */}
          </div>

          {/* <div className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between">
              <p className={cn("ty-h4 text-white-100")}>Comments</p>
            </div>

            <div className="-w-full flex items-center justify-between p-4 gap-4 bg-white-4 rounded-xl">
              <Avatar className="w-[40px] h-[40px]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Input
                className={cn("bg-transparent")}
                placeholder={
                  account?.address
                    ? "Add a comment"
                    : "Connect wallet to comment"
                }
                value={currentComment}
                onChange={(e) => {
                  setCurrentComment(e.target.value);
                }}
              ></Input>

              {account?.address ? (
                <Button
                  disabled={account?.address == undefined}
                  onClick={onComment}
                >
                  Send
                </Button>
              ) : (
                <></>
              )}
            </div>

            {comments?.map((comment: any) => {
              return (
                <div
                  key={comment?.id}
                  className="flex gap-4 p-4  bg-white-4 rounded-xl"
                >
                  <Avatar className="size-[40px]">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-4 w-full">
                    <div className="w-full flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <p className={cn("ty-title text-white-50")}>
                          {truncateAddress(comment?.user)}
                        </p>
                        <p className={cn("ty-descriptions text-white-50")}>
                          X minutes ago
                        </p>
                      </div>
                      <div className="flex items-center gap-">
                        <p className={cn("ty-title text-white-50")}>HEART</p>
                        <p className={cn("ty-title text-white-50")}>0</p>
                      </div>
                    </div>

                    <p className={cn("ty-subtext text-white-50 h-fit w-fit")}>
                      {comment?.data}
                    </p>
                  </div>
                </div>
              );
            })}
          </div> */}

          <div className="w-full flex flex-col gap-16 items-center h-[510px] justify-center">
            <div className="flex flex-col gap-4 items-center">
              <p className={cn("ty-h2 text-white-100")}>Candy Store NFTs are in high demand!</p>
              <p className={cn("ty-h2 text-white-100")}>Create yours now!</p>
            </div>

            <Button className={cn("bg-red-400 hover:bg-red-500 ty-title")}>Get Started Now</Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
interface INftImageProps {
  className?: string;
  jsonUrl?: string;
  number: number;
}

function NftImage({ jsonUrl, number, className }: INftImageProps) {
  const { data } = useFetchMetadata({
    url: jsonUrl ? `${jsonUrl}/${number}.json` : undefined,
  });

  if (data?.image == "") {
    return <></>;
  }
  return (
    <div className={cn(`${className ? className : "size-[150px]"} bg-white-4 rounded-3xl relative`)}>
      <Image
        // src={data?.image ?? `${ASSETS_URL}candyblinks.png`}
        src={`${ASSETS_URL}candyblinks.png`}
        alt="NFT Placeholder"
        fill
        className="object-cover rounded-2xl"
      />
    </div>
  );
}

// function PhaseCard() {
//   return (
//     <div className="w-full p-4 flex flex-col gap-2 bg-white-4 rounded-lg">
//       <div className="flex items-center justify-between">
//         <p className={cn("ty-title text-white-100")}>Whitelist</p>
//       </div>

//       <div className="flex items-center justify-between">
//         <p className={cn("ty-subtext text-white-50")}>Max mint 1 per wallet </p>
//         <p className={cn("ty-subtext text-white-100")}>2.10 SOL</p>
//       </div>
//     </div>
//   );
// }

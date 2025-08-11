"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import Navbar from "@/components/navbar";
import { useParams } from "next/navigation";
import Profile from "@/views/profile/profile";
import Referral from "@/views/profile/referral";
import Points from "@/views/profile/points";

import Footer from "@/components/footer";
import useFetchOwnedCandyStores from "@/hooks/api/useFetchOwnedCandyStores";
import useFetchMetadata from "@/hooks/useFetchMetadata";
import PhaseEditorDialog from "@/views/hub/phase-editor-dialog";
import { useStore } from "@/store/store";
import useFetchUserTransactions from "@/hooks/api/useFetchUserTransactions";
import Link from "next/link";

export default function Hub() {
  const params = useParams();
  const [activeComponent, setActiveComponent] = useState("profile");

  const mockData = [
    {
      id: "1",
      signature: "4xyEXUms77gjDXk2JkSvW9bVAzGg5SDJRJ2bMQwCokJeEYqvnhcbRqpBdoBvFMC8uvxEr9Y2sTbHhcsFUSV3MtiS",
      date_time: "3 days ago",
      type: "Minting",
      points: 1000,
    },
    {
      id: "2",
      signature: "4xyEXUms77gjDXk2JkSvW9bVAzGg5SDJRJ2bMQwCokJeEYqvnhcbRqpBdoBvFMC8uvxEr9Y2sTbHhcsFUSV3MtiS",
      date_time: "3 days ago",
      type: "Minting",
      points: 1000,
    },
    {
      id: "3",
      signature: "4xyEXUms77gjDXk2JkSvW9bVAzGg5SDJRJ2bMQwCokJeEYqvnhcbRqpBdoBvFMC8uvxEr9Y2sTbHhcsFUSV3MtiS",
      date_time: "3 days ago",
      type: "Minting",
      points: 1000,
    },
    {
      id: "4",
      signature: "4xyEXUms77gjDXk2JkSvW9bVAzGg5SDJRJ2bMQwCokJeEYqvnhcbRqpBdoBvFMC8uvxEr9Y2sTbHhcsFUSV3MtiS",
      date_time: "3 days ago",
      type: "Minting",
      points: 1000,
    },
    {
      id: "5",
      signature: "4xyEXUms77gjDXk2JkSvW9bVAzGg5SDJRJ2bMQwCokJeEYqvnhcbRqpBdoBvFMC8uvxEr9Y2sTbHhcsFUSV3MtiS",
      date_time: "3 days ago",
      type: "Minting",
      points: 1000,
    },
  ];

  useFetchUserTransactions({
    userAddress: params?.id ? (params?.id as string) : undefined,
  });

  const { data: candyStore } = useFetchOwnedCandyStores({
    accountAddress: params?.id as string,
  });

  const { data: collectionMetadata } = useFetchMetadata({
    url: candyStore?.url ? `${candyStore?.url}/collection.json` : undefined,
  });

  const { setHubPhases } = useStore();

  const [openPhaseEditor, setOpenPhaseEditor] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case "profile":
        return <Profile collectionMetadata={collectionMetadata} candyStore={candyStore} mock_data={mockData}/>;
      case "referral":
        return <Referral />;
      case "points":
        return <Points />;
      default:
        return <Profile collectionMetadata={collectionMetadata} candyStore={candyStore} mock_data={mockData}/>;
    }
  };

  const handleButtonClick = (component: string) => {
    setActiveComponent(component);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setHubPhases(candyStore?.phases ?? []);
  }, [setHubPhases, candyStore?.phases]);

  return (
    <>
      <Navbar />
      <PhaseEditorDialog
        open={openPhaseEditor}
        onOpenChange={setOpenPhaseEditor}
      />
      <div className="w-full flex items-start justify-center min-h-dvh h-full">

        <div className="hidden md:flex max-w-[280px] flex-shrink w-full md:w-[280px] h-[1010px]">
          <div className="fixed flex flex-col justify-start items-start w-[inherit] mt-8 h-full relative">
            <p className={cn("text-lg font-bold uppercase w-full text-center mb-5")}>Settings</p>
            <div className="flex flex-col gap-2 w-[inherit] h-[inherit]">
              <button
                className={cn("text-lg text-white-100 cursor-pointer text-left p-3 w-[80%] rounded-lg ml-5",
                  activeComponent === "profile" ? "bg-[#FAFCFF0A]" : "hover:bg-[#FAFCFF0A]"
                )}
                onClick={() => handleButtonClick("profile")}
              >
                Profile
              </button>
              <button
                className={cn("text-lg text-white-100 cursor-pointer text-left p-3 w-[80%] rounded-lg ml-5",
                  activeComponent === "referral" ? "bg-[#FAFCFF0A]" : "hover:bg-[#FAFCFF0A]"
                )}
                onClick={() => handleButtonClick("referral")}
              >
                Referral
              </button>
              <button
                className={cn("text-lg text-white-100 cursor-pointer text-left p-3 w-[80%] rounded-lg ml-5",
                  activeComponent === "points" ? "bg-[#FAFCFF0A]" : "hover:bg-[#FAFCFF0A]"
                )}
                onClick={() => handleButtonClick("points")}
              >
                Points
              </button>

              <Link
                href="/"
                className={cn("text-lg text-white-100 cursor-pointer text-left p-3 w-[80%] rounded-lg ml-5 mt-auto sticky bottom-0")}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>

        {renderComponent()}
      </div>
         <Footer />
    </>
  );
}

// interface INftCardProps {
//   jsonUrl?: string;
//   number: number;
// }

// function NftCard({ jsonUrl, number }: INftCardProps) {
//   const { data } = useFetchMetadata({
//     url: jsonUrl ? `${jsonUrl}/${number}.json` : undefined,
//   });

//   if (data?.image == "") {
//     return <></>;
//   }

//   return <></>;
//   return (
//     <div className="p-3 basis-[19.4%] gap-2 bg-white-4 rounded-lg shadow-lg flex flex-col w-fit items-center cursor-pointer hover:shadow-pink-600/50 hover:border-pink-600 transition duration-200 ease-in-out">
//       <div className="p-1 w-full flex items-center justify-center bg-black-4">
//         <div className="h-[180px] w-[180px] bg-red-200 rounded-2xl relative">
//           <Image
//             src={data?.image ?? null}
//             alt={data?.image ?? null}
//             fill
//             className="object-cover rounded-2xl"
//           ></Image>
//         </div>
//       </div>

//       <div className="w-full flex flex-col gap-2">
//         <div className={cn("ty-title")}>{data?.name}</div>
//         <div className={cn("ty-subtitle text-white-80")}>{data?.symbol}</div>
//       </div>
//     </div>
//   );
// }

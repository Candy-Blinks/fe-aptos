import { cn, truncateAddress } from "@/lib/utils";
import { Globe, X, Users, Rocket, Camera, Send, MessageCircle, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProfileProps {
  collectionMetadata?: {
    image?: string;
    symbol?: string;
  };
  candyStore?: {
    name?: string;
    website?: string;
    x?: string;
    ig?: string;
    tg?: string;
    discord?: string;
    yt?: string;
    url?: string;
  };
  mock_data?: Array<{
    id: string;
    signature: string,
    date_time: string,
    type: string,
    points: number,
  }>;
}

export default function Profile({ collectionMetadata, candyStore, mock_data }: ProfileProps) {
  return(
    <div className="max-w-[1280px] w-full flex-1 flex-col gap-8">
      <div className="w-full bg-white-4 p-8 flex flex-col gap-8">
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
            <div className="flex gap-8 relative">
              <div className="w-[150px] h-[150px] bg-red-50 absolute bottom-0 left-0 rounded-2xl ">
                <div className="h-full w-full relative">
                  <Image
                    src={
                      collectionMetadata?.image
                        ? collectionMetadata?.image
                        : "/images/cmb/collection.png"
                    }
                    alt={
                      collectionMetadata?.image
                        ? collectionMetadata?.image
                        : "/images/cmb/collection.png"
                    }
                    fill
                    className="object-cover rounded-2xl "
                  ></Image>
                </div>
              </div>
              <div className="w-[150px]"></div>
              <div className="flex flex-col gap-2">
                <p className={cn("ty-h6 text-white-100")}>
                  {candyStore?.name ? candyStore?.name : "Undefined"}
                </p>
                <p className={cn("ty-subheading text-white-50")}>
                  {collectionMetadata?.symbol
                    ? collectionMetadata?.symbol
                    : "Undefined"}
                </p>
              </div>

              <button className="flex ml-auto bg-[#883E3E] h-[40px] p-4 rounded-lg items-center">Follow</button>
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

            <div className="flex justify-between gap-4 border border-[#FAFCFF0A] p-3 rounded-lg">
              <div className="flex gap-2">
                <div className="px-1">
                  <Globe size={16} />
                </div>
                <div className="flex flex-col">
                  <p className={cn("ty-subtitle text-white-50")}>Website</p>
                    <Link href={"www.candyblinks.com"} target="_blank">
                      <p
                        className={cn(
                          "ty-descriptions text-white-100 underline"
                        )}
                      >
                        www.candyblinks.com
                      </p>
                    </Link>

                    {/* Candy Store Website Url return empty string. Rendered none. */}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="px-1">
                  <Users size={16} />
                </div>
                <div className="flex flex-col">
                  <p className={cn("ty-subtitle text-white-50")}>
                    Socials and Community
                  </p>

                  <div className="flex items-center gap-4">

                    <Link href="https://x.com/CandyBlinks_" target="_blank">
                      <X size={18} />
                    </Link>

                    <Link href="www.ig.com" target="_blank">
                      <Camera size={16} />
                    </Link>

                    <Link href="www.tg.com" target="_blank">
                      <Send size={16} />
                    </Link>


                    <Link href="www.discord.com" target="_blank">
                       <MessageCircle size={16}/>
                    </Link>


                    <Link href="www.yt.com" target="_blank">
                      <Play size={16} />
                    </Link>

                    {/* Candy Store Social Media Link return empty string! */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="basis-[50%] flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="w-full rounded-3xl border border-white-4 flex flex-col gap-4 p-4">
                <div className="flex w-full justify-between p-4 bg-white-16 rounded-xl">
                  <div className="flex flex-row items-center gap-2">
                    <div className="bg-[#0C0F1880] p-2 rounded-lg flex items-center justify-center">
                      <Rocket size={16} className="text-white-100" />
                    </div>
                    <p className={cn("ty-descriptions text-white-100 ")}>
                      Multiplier
                    </p>
                  </div>
                  <p className={cn("ty-title text-white-100 items-center flex")}>0.5x</p>
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
                <div className="flex w-full justify-between">
                  <p className={cn("ty-subtitle text-white-100 ")}>
                    Total Points
                  </p>
                  <p className={cn("ty-title text-white-100 ")}>10,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white-4 p-6 flex flex-col gap-4">
        <p className={cn("ty-subheading text-white-100 ")}>
          Latest Transactions
        </p>

        <div className="flex flex-col w-full gap-1">
          <div className="w-full flex justify-between items-center bg-white-4 p-4 rounded-xl">
            <div className="w-full">
              <p className={cn("ty-subheading text-white-100 ")}>Signature</p>
            </div>

            <div className="w-full basis-[40%] flex items-center justify-between">
              <p className={cn("ty-subtitle text-white-100 ")}>Date Time</p>
              <p className={cn("ty-subtitle text-white-100 ")}>
                Type
              </p>
              <p className={cn("ty-subtitle text-white-100 ")}>Points</p>
            </div>
          </div>

          {mock_data?.map((value: any) => {
            return (
              <div
                key={value.id}
                className="w-full flex justify-between items-center p-4 rounded-xl"
              >
                <div className="w-full">  
                  <p className={cn("ty-subtitle text-white-100 ")}>
                    {truncateAddress(value.signature)}
                  </p>
                </div>

                <div className="w-full basis-[40%] flex items-end gap-4 justify-between text-right">
                  <p className={cn("ty-subtitle text-white-500 ")}>
                    {value.date_time}
                  </p>

                  <p className={cn("ty-subtitle text-white-100 ")}>
                    {value.type}
                  </p>
                  <p className={cn("ty-subtitle text-white-100 ")}>
                    {value.points}
                  </p>
                </div>
              </div>
            );
          })}

          {/* {Array.from({ length: 9 }, (_, i) => i + 1).map((value) => {
            return (
              <div className="w-full flex justify-between items-center p-4 rounded-xl">
                <div className="w-full">
                  <p className={cn("ty-subheading text-white-100 ")}>
                    {truncateAddress(
                      "En7hmm8mhPV9aU1LxzyL7vjvGQuw9Ugai7rwHR4cnAvU"
                    )}
                  </p>
                </div>

                <div className="w-full basis-[70%] flex items-center gap-4 justify-between">
                  <p className={cn("ty-subtitle text-white-100 ")}>
                    {truncateAddress(
                      "En7hmm8mhPV9aU1LxzyL7vjvGQuw9Ugai7rwHR4cnAvU"
                    )}
                  </p>
                  <p className={cn("ty-subtitle text-white-100 ")}>
                    Created Candy Store
                  </p>
                  <p className={cn("ty-subtitle text-green-100 ")}>1000+</p>
                  <p className={cn("ty-subtitle text-white-100 ")}>
                    Date Created
                  </p>
                </div>
              </div>
            );
          })} */}
        </div>

        {/* <div className="flex flex-wrap gap-2">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((value) => {
            return (
              <NftCard
                jsonUrl={candyStore?.url}
                key={value}
                number={value - 1}
              />
            );
          })}
        </div> */}
      </div>

      {/* <div className="bg-white-4 border border-white-8 p-6 rounded-xl flex flex-col gap-4">
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
          {Array.from({ length: 9 }, (_, i) => i + 1).map((value) => {
            return (
              <NftCard
                jsonUrl={candyStore?.url}
                key={value}
                number={value - 1}
              />
            );
          })}
        </div>
      </div> */}
    </div>
  )
}
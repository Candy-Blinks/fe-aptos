"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CollectionCard from "@/views/feed/collection-card";
//import useLaunchpadProgram from "@/hooks/programs/useLaunchpadProgram";
import { Button } from "@/components/ui/button";
import CreatorCard from "@/views/feed/creator-card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ASSETS_URL } from "@/lib/constants";
import { useState } from "react";
import FeedForyou from "@/views/feed/feed-foryou";
import FeedFollowing from "@/views/feed/feed-following";
import FeedTrending from "@/views/feed/feed-trending";

export default function page() {
  //const { fetchAllCandyStores } = useLaunchpadProgram();
  // Mocked fetchAllCandyStores structure to prevent runtime errors
  const fetchAllCandyStores = { data: [] };

  const [feedIsActive, setFeedIsActive] = useState("foryou");
  const profileImageUrl = "/images/cmb/2.png";

  function handleFeedChange(feed: string) {
    setFeedIsActive(feed);
  }

  const user = {
    id: "1",
    name: "John Doe",
    profileImageUrl: "/images/cmb/2.png",
    followers: { total: 100, followersIds: ["1", "2", "3"] },
    following: { total: 50, followersIds: ["1", "2", "3"] },
  };

  const posts = [
    {
      postId: "postId-1",
      isColelctionShare: false,
      collectionId: "",
      text: "In the fast-paced world of corporate life, it's crucial to prioritize your mental peace. Take moments to breathe, reflect, and recharge. Seek solace in small rituals, like morning walks, deep breaths, or a quick meditation session during breaks. #mentalpeace #corporatelife",
      created_at: "2023-10-01T12:00:00Z",
      likes: 43,
      comments: 69,
    },
    {
      postId: "postId-2",
      isColelctionShare: true,
      collectionId: "cmb-01",
      text: "In the fast-paced world colection of corporate life, it's crucial to prioritize your mental peace. Take moments to breathe, reflect, and recharge. Seek solace in small rituals, like morning walks, deep breaths, or a quick meditation session during breaks. #mentalpeace #corporatelife",
      created_at: "2023-10-01T12:00:00Z",
      likes: 69,
      comments: 13,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="w-full flex items-center justify-center mt-10">
        <div className="max-w-[1420px] w-full flex justify-center">
          <aside className="flex border border-white-4 rounded-2xl flex-col justify-start h-fit items-center gap-4 p-4 w-[293px]">
            <p className="flex justify-center items-center text-center w-full">Featuered Collections</p>

            <div className="flex justify-center items-center flex-col gap-4">
              {fetchAllCandyStores.data?.slice(0, 3).map((candyStore: any) => {
                // TODO: make the algorithim for what defines 'featured collection' like sort it by mint count activity and choose the top 3
                return (
                  <CollectionCard
                    key={candyStore.address}
                    jsonUrl={candyStore.url}
                    publicKey={candyStore.address}
                    name={candyStore.name}
                  />
                );
              })}
            </div>
          </aside>

          <main className="w-[722px] flex flex-col gap-6 mx-6">
            <section className="flex items-center justify-between h-[50px] rounded-xl ">
              <div className="flex p-2 rounded-xl gap-[10px] items-center justify-start h-[50px] bg-white-4">
                <Button
                  onClick={() => handleFeedChange("foryou")}
                  className={cn(
                    "bg-transparent text-white-50 font-normal rounded-sm hover:bg-white-4",
                    feedIsActive === "foryou" && "bg-pink-100 hover:bg-pink-80 text-white-100 font-semibold",
                  )}
                >
                  For you
                </Button>
                <Button
                  onClick={() => handleFeedChange("trending")}
                  className={cn(
                    "bg-transparent text-white-50 font-normal rounded-sm hover:bg-white-4",
                    feedIsActive === "trending" && "bg-pink-100 hover:bg-pink-80 text-white-100 font-semibold",
                  )}
                >
                  Trending
                </Button>
                <Button
                  onClick={() => handleFeedChange("following")}
                  className={cn(
                    "bg-transparent text-white-50 font-normal rounded-sm hover:bg-white-4",
                    feedIsActive === "following" && "bg-pink-100 hover:bg-pink-80 text-white-100 font-semibold",
                  )}
                >
                  Following
                </Button>
              </div>

              <div className="flex h-[50px] max-w-[374px] p-2 items-center justify-between w-full bg-white-4 rounded-xl">
                <div className="flex px-2 py-1 items-center w-full rounded-l bg-white-4 ">
                  <figure className="size-[16px] mx-3">
                    <Image
                      src={`${ASSETS_URL}icons/feed-search.svg`}
                      alt="search icon"
                      width={16}
                      height={16}
                      priority
                      className="object-contain  size-[16px]"
                    />
                  </figure>
                  <input
                    type="text"
                    placeholder="Search"
                    className="font-normal placeholder:text-[18px] text-[18px] text-white-50 w-full bg-transparent outline-none placeholder:text-white-32 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col bg-white-4 gap-4 p-5 rounded-xl">
              <div className="flex w-full gap-3 items-center justify-center">
                <figure className="size-[40px]">
                  <Image
                    src={profileImageUrl}
                    alt="profile icon"
                    width={40}
                    height={40}
                    priority
                    className="object-cover size-[40px] rounded-[8px]"
                  />
                </figure>
                <div className="rounded-[8px] bg-white-4 h-[49px] flex items-center justify-start w-full">
                  <p className="p-4 text-[16px] font-normal text-white-50">Share your mind?</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-4 justify-between items-center">
                  <figure className="cursor-pointer size-[24px]">
                    <Image
                      src={`${ASSETS_URL}icons/feed-image.svg`}
                      alt="upload image icon"
                      width={24}
                      height={24}
                      priority
                      className="object-contain  size-[24px]"
                    />
                  </figure>
                  <figure className="cursor-pointer size-[24px]">
                    <Image
                      src={`${ASSETS_URL}icons/feed-video.svg`}
                      alt="upload video icon"
                      width={24}
                      height={24}
                      priority
                      className="object-contain  size-[24px]"
                    />
                  </figure>
                  <figure className="cursor-pointer size-[24px]">
                    <Image
                      src={`${ASSETS_URL}icons/feed-schedule.svg`}
                      alt="schedule upload icon"
                      width={24}
                      height={24}
                      priority
                      className="object-contain  size-[24px]"
                    />
                  </figure>
                </div>
                <Button className="cursor-pointer bg-pink-50 hover:bg-pink-72">Create a post</Button>
              </div>
            </section>

            {/* // ? these are working, but still have to se. a function for filteration into a proper algo */}
            {feedIsActive === "foryou" && <FeedForyou posts={posts} user={user} />}
            {feedIsActive === "trending" && <FeedTrending posts={posts} user={user} />}
            {feedIsActive === "following" && <FeedFollowing posts={posts} user={user} />}
          </main>

          <aside className="flex border h-fit border-white-4 rounded-2xl flex-col justify-start items-center gap-4 p-4 w-[293px]">
            <p className="flex justify-center items-center text-center w-full">Featuered Creators</p>

            <div className="flex justify-center items-center flex-col gap-4">
              <CreatorCard
                // key={candyStore.address}
                imageUrl={"/images/cmb/2.png"}
                creatorId={"creator1"}
                name={"Creator 1"}
              />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}

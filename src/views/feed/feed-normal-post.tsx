import { ASSETS_URL } from "@/constants";
import Image from "next/image";
import PostActions from "@/views/feed/post-actions";
import TipButton from "@/views/feed/tip-button";

export default function FeedNormalPost({
  userData,
  postData,
}: {
  userData: any;
  postData: any;
}) {
  const profileImageUrl = userData?.profileImageUrl || "/images/cmb/2.png";
  return (
    <article className="flex flex-col gap-4 bg-white-4 p-5 rounded-xl">
      <div className="flex gap-2">
        <figure className="size-[40px] rounded-full">
          <Image
            src={profileImageUrl}
            alt="profile icon"
            width={40}
            height={40}
            priority
            className="object-cover size-[40px] rounded-full"
          />
        </figure>
        <div className="flex flex-col h-[40px]">
          <p className="text-[18px] p-0 font-semibold text-white-80">
            {userData?.name}
          </p>
          {/* // TODO: make a function that normalize the 'created at' of the post into readable conveniences */}
          <p className="text-[16px] p-0 leading-[8px] font-semibold text-white-50">
            {/* {postData?.createdAt
              ? new Date(postData?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }) : "" } */}
            12h ago
          </p>
        </div>
      </div>

      <div className="text-white-72 flex w-full">
        {/* // TODO: make a function where if there is a hashtag, it will turn into a link to search for te same tags */}
        <p className="leading-[16px]">{postData?.text} </p>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex justify-between w-full items-center">
          <PostActions
            postId={postData?.postId}
            likes={postData?.likes}
            comments={postData?.comments}
          />

          <div className="flex justify-between items-center gap-2">
            <TipButton
              currency={"$"}
              amount={"1.00"}
              icon={`${ASSETS_URL}icons/feed-solana-colored.svg`}
            />
            <TipButton
              currency={"$"}
              amount={"1.50"}
              icon={`${ASSETS_URL}icons/feed-solana-colored.svg`}
            />
            <TipButton
              currency={"$"}
              amount={"2.00"}
              icon={`${ASSETS_URL}icons/feed-solana-colored.svg`}
            />
            <div
              className="
                          cursor-pointer py-1 px-[7px] bg-transparent
                        flex w-fit rounded-[8px] hover:bg-white-4 justify-between gap-1"
            >
              <figure className="size-[24px]">
                <Image
                  src={`${ASSETS_URL}icons/feed-share.svg`}
                  alt="share icon"
                  width={24}
                  height={24}
                  priority
                  className="object-contain size-[24px]"
                />
              </figure>
              <p className="font-normal text-[16px] text-white-72 whitespace-nowrap">
                Share
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-3 items-center justify-center">
        <figure className="size-[40px]">
          <Image
            src={profileImageUrl}
            alt="solana icon"
            width={40}
            height={40}
            priority
            className="object-cover size-[40px] rounded-[8px]"
          />
        </figure>
        <div className="rounded-[8px] bg-white-4 h-[49px] flex items-center justify-start w-full">
          <p className="p-4 text-[16px] font-normal text-white-50">
            Write your comment
          </p>
        </div>
      </div>
    </article>
  );
}

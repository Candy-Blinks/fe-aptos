import { ASSETS_URL } from "@/constants";
import Image from "next/image";

export default function PostActions({
  likes,
  comments,
  postId,
}: {
  likes: number;
  comments: number;
  postId: string;
}) {
  // TODO make a function depending on comment ID to add comments and likes to the post
  console.log(postId);
  return (
    <div className="flex justify-between items-center gap-[18px]">
      <div className="flex justify-between items-center gap-2">
        <figure className="cursor-pointer size-[24px]">
          <Image
            src={`${ASSETS_URL}icons/heart.svg`}
            alt="heart"
            width={24}
            height={24}
            priority
            className="object-contain size-[24px]"
          />
        </figure>
        {likes >= 1 ? (
          <p className="font-normal text-[16px] text-white-72 whitespace-nowrap">
            {likes} <span>Likes</span>
          </p>
        ) : (
          ""
        )}
      </div>
      <div className="flex cursor-pointer justify-between items-center gap-2">
        <figure className="size-[24px]">
          <Image
            src={`${ASSETS_URL}icons/message-2.svg`}
            alt="comments"
            width={24}
            height={24}
            priority
            className="object-contain size-[24px]"
          />
        </figure>
        {comments >= 1 ? (
          <p className="font-normal text-[16px] text-white-72 whitespace-nowrap">
            {comments} <span>Comments</span>
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

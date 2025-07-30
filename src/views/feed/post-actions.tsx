import { ASSETS_URL } from "@/lib/constants";
import Image from "next/image";
import { useState } from "react";
import useLikePost from "@/hooks/api/post/useLikePost";
import { toast } from "sonner";
import { useWalletUser } from "@/hooks/useWalletUser";

export default function PostActions({ 
  likes, 
  comments, 
  postId, 
  onCommentClick 
}: { 
  likes: number; 
  comments: number; 
  postId: string;
  onCommentClick?: () => void;
}) {
  const { aptosAddress } = useWalletUser();
  const [localLikes, setLocalLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false); // TODO: Get actual like status from API
  
  // Like functionality
  const { mutate: likePost, isPending: isLiking } = useLikePost();

  const handleLike = () => {
    if (!aptosAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    likePost(
      {
        postId: postId,
        aptos_address: aptosAddress,
      },
      {
        onSuccess: (data) => {
          // Update local state optimistically
          if (isLiked) {
            setLocalLikes(prev => prev - 1);
            setIsLiked(false);
          } else {
            setLocalLikes(prev => prev + 1);
            setIsLiked(true);
          }
          toast.success(isLiked ? "Post unliked" : "Post liked!");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to like post");
        },
      }
    );
  };

  const handleComment = () => {
    if (onCommentClick) {
      onCommentClick();
    } else {
      toast.info("Comment section toggle functionality coming soon!");
    }
  };

  return (
    <div className="flex justify-between items-center gap-[18px]">
      <div className="flex justify-between items-center gap-2">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className="cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <figure className="size-[24px]">
            <Image
              src={`${ASSETS_URL}icons/heart.svg`}
              alt="heart"
              width={24}
              height={24}
              priority
              className={`object-contain size-[24px] ${isLiked ? 'opacity-100' : 'opacity-70'}`}
            />
          </figure>
        </button>
        {localLikes >= 1 ? (
          <p className="font-normal text-[16px] text-white-72 whitespace-nowrap">
            {localLikes} <span>Likes</span>
          </p>
        ) : (
          ""
        )}
      </div>
      
      <div className="flex cursor-pointer justify-between items-center gap-2">
        <button 
          onClick={handleComment}
          className="cursor-pointer hover:opacity-70 transition-opacity"
        >
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
        </button>
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

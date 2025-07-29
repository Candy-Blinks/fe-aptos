import { ASSETS_URL } from "@/lib/constants";
import Image from "next/image";
import PostActions from "@/views/feed/post-actions";
import TipButton from "@/views/feed/tip-button";
import { PostWithRelations } from "@/hooks/api/post/types";
import { toast } from "sonner";
import { useState, KeyboardEvent } from "react";
import useCreateComment from "@/hooks/api/post/useCreateComment";
import useSharePost from "@/hooks/api/post/useSharePost";
import { useWalletUser } from "@/hooks/useWalletUser";

export default function FeedNormalPost({ userData, postData }: { userData: any; postData: PostWithRelations }) {
  const profileImageUrl = userData?.profileImageUrl || "/images/cmb/2.png";
  const { aptosAddress } = useWalletUser();
  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment();
  const { mutate: sharePost, isPending: isSharing } = useSharePost();
  
  // Format the created_at date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCommentSubmit = () => {
    if (!aptosAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (commentContent.length > 255) {
      toast.error("Comment must be 255 characters or less");
      return;
    }

    createComment(
      {
        post_id: postData.id,
        aptos_address: aptosAddress,
        content: commentContent,
      },
      {
        onSuccess: () => {
          toast.success("Comment posted successfully!");
          setCommentContent(""); // Clear the input
        },
        onError: (error) => {
          toast.error(error.message || "Failed to post comment");
        },
      }
    );
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleShare = () => {
    if (!aptosAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    sharePost(
      {
        originalPostId: postData.id,
        aptos_address: aptosAddress,
      },
      {
        onSuccess: () => {
          toast.success("Post shared successfully!");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to share post");
        },
      }
    );
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

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
        <div className="flex flex-col min-h-[40px] h-fit">
          <p className="text-[18px] p-0 font-semibold text-white-80">
            {postData.user?.display_name || postData.user?.username || "Unknown User"}
          </p>
          <p className="text-[16px] p-0 leading-[8px] font-semibold text-white-50">
            {formatDate(postData.created_at)}
          </p>
        </div>
      </div>

      <div className="text-white-72 flex w-full box-content">
        {/* TODO: make a function where if there is a hashtag, it will turn into a link to search for the same tags */}
        <p className="leading-[16px] w-full box-content break-words overflow-wrap-anywhere whitespace-pre-wrap">{postData.content}</p>
      </div>

      {/* Display media if present */}
      {postData.media_urls && postData.media_urls.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {postData.media_urls.slice(0, 4).map((mediaUrl, index) => (
            <div key={index} className="relative">
              <Image
                src={mediaUrl}
                alt={`Post media ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex w-full justify-between">
        <div className="flex justify-between w-full items-center">
          <PostActions 
            postId={postData.id} 
            likes={postData.like_count} 
            comments={postData.comment_count}
            onCommentClick={toggleComments}
          />

          <div className="flex justify-between items-center gap-2">
            {/* <TipButton currency={"$"} amount={"1.00"} icon={`${ASSETS_URL}icons/feed-aptos-colored.svg`} /> */}
            {/* <TipButton currency={"$"} amount={"1.50"} icon={`${ASSETS_URL}icons/feed-aptos-colored.svg`} /> */}
            {/* <TipButton currency={"$"} amount={"2.00"} icon={`${ASSETS_URL}icons/feed-aptos-colored.svg`} /> */}
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="
                        cursor-pointer py-1 px-[7px] bg-transparent
                      flex w-fit rounded-[8px] hover:bg-white-4 justify-between gap-1 transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="font-normal text-[16px] text-white-72 whitespace-nowrap">Share</p>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Input - Always Visible */}
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
        <div className="rounded-[8px] bg-white-4 h-[49px] flex items-center justify-start w-full relative">
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write your comment..."
            maxLength={255}
            disabled={isCreatingComment}
            className="w-full h-full p-4 text-[16px] font-normal text-white-100 bg-transparent outline-none placeholder:text-white-50 disabled:opacity-50"
          />
          {commentContent.length > 0 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white-50">
              {commentContent.length}/255
            </div>
          )}
        </div>
      </div>

      {/* Comments Display - Toggleable */}
      {showComments && postData.comments && postData.comments.length > 0 && (
        <div className="flex flex-col gap-3">
          {postData.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 items-start">
              <figure className="size-[32px]">
                <Image
                  src={comment.user?.profile_url || "/images/cmb/2.png"}
                  alt="commenter profile"
                  width={32}
                  height={32}
                  priority
                  className="object-cover size-[32px] rounded-full"
                />
              </figure>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-white-80">
                    {comment.user?.display_name || comment.user?.username || "Unknown User"}
                  </p>
                  <p className="text-[12px] text-white-50">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                <p className="text-[14px] text-white-72">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

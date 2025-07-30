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
import { useState, useRef } from "react";
import FeedForyou from "@/views/feed/feed-foryou";
import FeedFollowing from "@/views/feed/feed-following";
import FeedTrending from "@/views/feed/feed-trending";
import useCreatePost from "@/hooks/api/post/useCreatePost";
import { toast } from "sonner";
import useFetchAllUsers from "@/hooks/api/users/useFetchAllUsers";
import useCheckFollowStatus from "@/hooks/api/users/useCheckFollowStatus";
import useFollowUser from "@/hooks/api/users/useFollowUser";
import useFetchAllPosts from "@/hooks/api/post/useFetchAllPosts";
import useFetchAllFollowingPosts from "@/hooks/api/post/useFetchAllFollowingPosts";
import useFetchAllCollections from "@/hooks/api/collection/useFetchAllCollections";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useWalletUser } from "@/hooks/useWalletUser";

// Wrapper component to handle follow status for each user
interface CreatorCardWithFollowStatusProps {
  user: {
    id: string;
    username: string;
    aptos_address: string;
    display_name: string;
    profile_url?: string;
  };
  currentUserAptosAddress?: string;
  onFollowClick: () => void;
  isFollowLoading: boolean;
}

function CreatorCardWithFollowStatus({
  user,
  currentUserAptosAddress,
  onFollowClick,
  isFollowLoading,
}: CreatorCardWithFollowStatusProps) {
  // Check if current user is following this user
  const { data: followStatus } = useCheckFollowStatus({
    follower_aptos_address: currentUserAptosAddress || "",
    following_aptos_address: user.aptos_address,
  });

  return (
    <CreatorCard
      imageUrl={user.profile_url || "/images/cmb/2.png"} // Use profile_url or fallback
      creatorId={user.username}
      name={user.display_name}
      aptosAddress={user.aptos_address}
      isFollowing={followStatus?.isFollowing || false}
      onFollowClick={onFollowClick}
      isFollowLoading={isFollowLoading}
    />
  );
}

export default function page() {
  //const { fetchAllCandyStores } = useLaunchpadProgram();
  // Fetch all collections
  const { data: allCollections = [], isLoading: isLoadingCollections } = useFetchAllCollections();

  const [feedIsActive, setFeedIsActive] = useState("foryou");
  const profileImageUrl = "/images/cmb/2.png";

  // Post creation state
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { mutate: createPost, isPending: isCreatingPost } = useCreatePost();
  const { aptosAddress, user, isAuthenticated } = useWalletUser();
  const queryClient = useQueryClient();

  // Fetch all users (limit to get more than 3 to filter from)
  const { data: allUsers = [], isLoading: isLoadingUsers } = useFetchAllUsers({ take: 20 });

  // Fetch posts based on feed type
  const { data: globalPosts = [], isLoading: isLoadingGlobalPosts } = useFetchAllPosts({ take: 20 });
  const { data: followingPosts = [], isLoading: isLoadingFollowingPosts } = useFetchAllFollowingPosts({
    aptos_address: aptosAddress || "",
    take: 20,
  });

  // Follow functionality
  const { mutate: followUser, isPending: isFollowLoading } = useFollowUser();

  // Filter users that are not followed by current user and exclude current user
  const suggestedUsers = useMemo(() => {
    if (!aptosAddress || !allUsers.length) return [];

    return allUsers
      .filter((suggestedUser) => suggestedUser.aptos_address !== aptosAddress) // Exclude current user
      .slice(0, 3); // Take only 3 users for suggestions
  }, [allUsers, aptosAddress]);

  // Handle follow action
  const handleFollowUser = (targetUserAptosAddress: string) => {
    if (!aptosAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    followUser(
      {
        follower_aptos_address: aptosAddress,
        following_aptos_address: targetUserAptosAddress,
      },
      {
        onSuccess: () => {
          toast.success("Successfully followed user!");
          // Invalidate queries to refresh the data
          queryClient.invalidateQueries({ queryKey: ["followStatus"] });
          queryClient.invalidateQueries({ queryKey: ["userFollowing"] });
          queryClient.invalidateQueries({ queryKey: ["userFollowers"] });
        },
        onError: (error) => {
          toast.error(error.message || "Failed to follow user");
        },
      },
    );
  };

  function handleFeedChange(feed: string) {
    setFeedIsActive(feed);
  }

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Check file limit
    if (fileArray.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    // Check file types (only images)
    const validFiles = fileArray.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== fileArray.length) {
      toast.error("Only image files are allowed");
      return;
    }

    setSelectedFiles(validFiles);

    // Create preview URLs
    const urls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // Remove selected image
  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);

    // Revoke the removed URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  // Handle post creation
  const handleCreatePost = () => {
    if (!aptosAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!postContent.trim()) {
      toast.error("Please enter some content for your post");
      return;
    }

    if (postContent.length > 500) {
      toast.error("Post content must be 500 characters or less");
      return;
    }

    createPost(
      {
        aptos_address: aptosAddress,
        content: postContent.trim(),
        files: selectedFiles.length > 0 ? selectedFiles : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Post created successfully!");
          // Reset form
          setPostContent("");
          setSelectedFiles([]);
          setPreviewUrls([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create post");
        },
      },
    );
  };

  // Get grid class based on number of images
  const getImageGridClass = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2"; // 2x2 grid with one empty space
      case 4:
        return "grid-cols-2";
      default:
        return "grid-cols-1";
    }
  };

  // Use real user data from wallet connection
  const userProfile = user
    ? {
        id: user.id,
        name: user.display_name || user.username,
        username: user.username,
        aptosAddress: user.aptos_address,
        displayName: user.display_name,
        profileImageUrl: user.profile_url || "/images/cmb/2.png",
        followers: { total: 0, followersIds: [] }, // Will be populated when we add follower counts
        following: { total: 0, followersIds: [] }, // Will be populated when we add following counts
      }
    : null;

  // Debug: Log user data to see if profile_url is being fetched
  console.log("User data:", user);
  console.log("User profile URL:", user?.profile_url);

  // Get posts based on active feed
  const getPostsForFeed = () => {
    switch (feedIsActive) {
      case "foryou":
        return globalPosts;
      case "following":
        return followingPosts;
      case "trending":
        return globalPosts; // For now, use global posts for trending
      default:
        return globalPosts;
    }
  };

  const currentPosts = getPostsForFeed();
  const isLoadingPosts =
    feedIsActive === "foryou" || feedIsActive === "trending" ? isLoadingGlobalPosts : isLoadingFollowingPosts;

  return (
    <>
      <Navbar />
      <div className="w-full flex items-center justify-center mt-10">
        <div className="max-w-[1420px] w-full flex justify-center">
          <aside className="flex border border-white-4 rounded-2xl flex-col justify-start h-fit items-center gap-4 p-4 w-[293px]">
            <p className="flex justify-center items-center text-center w-full">Featuered Collections</p>

            <div className="flex justify-center items-center flex-col gap-4">
              {allCollections.slice(0, 3).map((collection: any) => {
                // TODO: make the algorithim for what defines 'featured collection' like sort it by mint count activity and choose the top 3
                return (
                  <CollectionCard
                    key={`${collection.collection_owner}-${collection.collection_name}`}
                    jsonUrl={collection.collection_uri}
                    publicKey={`${collection.collection_owner}/${collection.collection_name}`}
                    name={collection.collection_name}
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
              <div className="flex w-full gap-3 items-start">
                <figure className="size-[40px] flex-shrink-0 mt-1">
                  <Image
                    src={user?.profile_url || profileImageUrl}
                    alt="profile icon"
                    width={40}
                    height={40}
                    priority
                    className="object-cover size-[40px] rounded-[8px]"
                    key={user?.profile_url || "default"}
                  />
                </figure>
                <div className="flex flex-col w-full gap-2">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share your mind?"
                    className="w-full min-h-[49px] max-h-[120px] p-4 text-[16px] font-normal text-white-100 bg-white-8 rounded-[8px] resize-none outline-none placeholder:text-white-50 focus:ring-2 focus:ring-pink-50 focus:ring-opacity-50"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span
                      className={cn(
                        "text-white-50",
                        postContent.length > 450 && "text-yellow-500",
                        postContent.length >= 500 && "text-red-500",
                      )}
                    >
                      {postContent.length}/500
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Preview Grid */}
              {previewUrls.length > 0 && (
                <div className={cn("grid gap-2 mt-2", getImageGridClass(previewUrls.length))}>
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isCreatingPost}
                  />

                  <figure
                    className="cursor-pointer size-[24px] hover:opacity-70 transition-opacity"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image
                      src={`${ASSETS_URL}icons/feed-image.svg`}
                      alt="upload image icon"
                      width={24}
                      height={24}
                      priority
                      className="object-contain size-[24px]"
                    />
                  </figure>
                  <figure className="cursor-pointer size-[24px] opacity-50">
                    <Image
                      src={`${ASSETS_URL}icons/feed-video.svg`}
                      alt="upload video icon"
                      width={24}
                      height={24}
                      priority
                      className="object-contain size-[24px]"
                    />
                  </figure>
                  <figure className="cursor-pointer size-[24px] opacity-50">
                    <Image
                      src={`${ASSETS_URL}icons/feed-schedule.svg`}
                      alt="schedule upload icon"
                      width={24}
                      height={24}
                      priority
                      className="object-contain size-[24px]"
                    />
                  </figure>
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={isCreatingPost || !postContent.trim() || postContent.length > 500}
                  className="cursor-pointer bg-pink-50 hover:bg-pink-72 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingPost ? "Posting..." : "Create a post"}
                </Button>
              </div>
            </section>

            {/* Feed content with loading states */}
            {isLoadingPosts ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-white-50">Loading posts...</p>
              </div>
            ) : (
              <>
                {feedIsActive === "foryou" && <FeedForyou posts={currentPosts} user={userProfile} />}
                {feedIsActive === "trending" && <FeedTrending posts={currentPosts} user={userProfile} />}
                {feedIsActive === "following" && <FeedFollowing posts={currentPosts} user={userProfile} />}
              </>
            )}
          </main>

          <aside className="flex border h-fit border-white-4 rounded-2xl flex-col justify-start items-center gap-4 p-4 w-[293px]">
            <p className="flex justify-center items-center text-center w-full">Featured Creators</p>

            <div className="flex justify-center items-center flex-col gap-4">
              {isLoadingUsers ? (
                <div className="text-white-50">Loading suggestions...</div>
              ) : suggestedUsers.length > 0 ? (
                suggestedUsers.map((suggestedUser) => (
                  <CreatorCardWithFollowStatus
                    key={suggestedUser.id}
                    user={suggestedUser}
                    currentUserAptosAddress={aptosAddress}
                    onFollowClick={() => handleFollowUser(suggestedUser.aptos_address)}
                    isFollowLoading={isFollowLoading}
                  />
                ))
              ) : (
                <div className="text-white-50 text-center">No suggestions available</div>
              )}
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}

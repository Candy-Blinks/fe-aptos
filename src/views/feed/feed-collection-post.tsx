import { ASSETS_URL } from "@/constants";
import Image from "next/image";
import PostActions from "@/views/feed/post-actions";
import { Button } from "@/components/ui/button";

export default function FeedCollectionPost({
  userData,
  postData,
}: {
  userData: any;
  postData: any;
}) {
  const profileImageUrl = userData?.profileImageUrl || "/images/cmb/2.png";

  const nftCollections = [
    {
      collectionId: "cmb-01", //for thr id, we can either addresss or collection
      name: "Candy Mob Business",
      imageUrl: "/images/cmb/2.png",
      // delete this image url to get the collection image
      description:
        "Candy Mob Business is a collection of 10,000 unique NFTs that represent ownership of a digital asset on the Aptos blockchain. Each NFT is a one-of-a-kind piece of art that is stored on the blockchain, ensuring its authenticity and scarcity. The collection features a variety of designs and styles, making it a must-have for any NFT collector.",
      mintAddress: "cmb-01",

      address: "GJrHBFafo9F2am5kEUBi4hyckrCmDX9fWUopFxEj1LeA",
      banner: "bafkreifblck45ecoyj66icqfsn6wvr5d2trpobqokylqo7ugx3u4mccpk4",
      collection: "HhBhrPDRoy9R6biGRm9DahbA5LEdgL9Wu2PyGoXvxAhs",
      deleted: true,
      // description: "TEST",
      discord: "",
      instagram: null,
      manifestId: "bafybeicbqjqmtjjr6sx3ejnpn26jmrk6jkltruk6tetf3bzohjxyie6ney",
      minted: "1",
      // name: "TEST",
      numberOfItems: "10",
      owner: "EmLjorA1Bw2puKDCWQWmzf26mJYNGXeDTeUxPrpyMTGX",
      phases: [
        {
          id: "GJrHBFafo9F2am5kEUBi4hyckrCmDX9fWUopFxEj1LeAWL",
          label: "WL",
          candyStoreAddress: "GJrHBFafo9F2am5kEUBi4hyckrCmDX9fWUopFxEj1LeA",
          startDate: {},
          endDate: {},
        },
      ],
      published: false,
      telegram: "",
      url: "https://crimson-quickest-ermine-498.mypinata.cloud/ipfs/bafybeicbqjqmtjjr6sx3ejnpn26jmrk6jkltruk6tetf3bzohjxyie6ney",
      website: "Tst",
      x: "Tets",
      youtube: "",
    },
  ];

  const collectionData = nftCollections.find(
    (collection) => collection.collectionId === postData.collectionId
  );

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

      <div className="flex w-full justify-center items-center">
        <div className="flex w-[432px] bg-white-4 border border-white-16 rounded-2xl flex-col p-4 gap-4 items-center justify-center">
          <figure className="size-[400px]">
            <Image
              src={profileImageUrl}
              alt="profile icon"
              width={400}
              height={400}
              priority
              className="object-cover size-[400px] rounded-2xl"
            />
          </figure>
          <div className="flex flex-col w-full px-1 gap-2">
            <p className="w-full text-start leading-[16px] text-white-100 font-semibold text-[18px]">
              {collectionData?.name}
            </p>
            <p className="w-full text-start leading-[16px] text-white-72 font-normal text-[18px]">
              {collectionData?.description}
            </p>
          </div>
          <Button
            // TODO: make a function that will mint the NFT
            className="cursor-pointer bg-pink-50 hover:bg-pink-72 w-full rounded-[8px] py-3 text-white-100 font-semibold text-[18px]"
          >
            Mint
          </Button>
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex justify-between w-full items-center">
          <PostActions
            postId={postData?.postId}
            likes={postData?.likes}
            comments={postData?.comments}
          />

          <div className="flex justify-between items-center gap-2">
            <div
              className="
                      cursor-pointer py-1 px-[7px] bg-transparent
                    flex w-fit rounded-[8px] hover:bg-white-4 justify-between gap-1"
            >
              <figure className="size-[24px]">
                <Image
                  src={`${ASSETS_URL}icons/tips.svg`}
                  alt="share icon"
                  width={24}
                  height={24}
                  priority
                  className="object-contain size-[24px]"
                />
              </figure>
              <p className="font-normal text-[16px] text-white-72 whitespace-nowrap">
                Tip
              </p>
            </div>
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

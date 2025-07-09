import { FC } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  imageUrl: string;
  creatorId: string;
  name: string;
}

const CreatorCard: FC<CardProps> = ({ imageUrl, creatorId, name }) => {
  return (
    <Card className="flex flex-col gap-4 w-[261px] p-4 h-[178px] overflow-hidden border-0 justify-between items-center bg-white-4">
      {/* <div className="w-[94px] h-[97px] gap-4 flex flex-col justify-between"> */}
      <CardContent className=" p-0 gap-2 overflow-visible justify-start flex w-full h-[90px]">
        <div>
          <Image
            src={imageUrl}
            alt={name}
            className="w-[72px] h-[90px] object-cover bg-center rounded-lg"
            width={72}
            height={90}
          />
        </div>
        <div className="flex relative gap-1">
          <Image
            src={imageUrl}
            alt={name}
            className="w-[56px] h-[90px] object-cover bg-center rounded-lg"
            width={56}
            height={90}
          />
          <Image
            src={imageUrl}
            alt={name}
            className="w-[56px] h-[90px] object-cover bg-center rounded-lg"
            width={56}
            height={90}
          />
          <Image
            src={imageUrl}
            alt={name}
            className="w-[56px] h-[90px] object-cover bg-center rounded-lg"
            width={56}
            height={90}
          />
          <div className="absolute bg-gradient-to-r from-[#00000001] to-[#16171F] h-[90px] w-[175px]"></div>
        </div>
      </CardContent>
      <CardFooter className="p-0 flex justify-between w-full h-[40px]">
        <div className="flex gap-2 items-center">
          <div>
            <Image
              src={imageUrl}
              alt="Collection Image"
              className="size-[40px] object-cover rounded-lg"
              width={40}
              height={40}
            />
          </div>
          <div className="flex flex-col justify-around">
            <p className="text-[15px] font-semibold  text-white-100">{name}</p>
            <Link
              href={`/profile/${creatorId}`}
              className=" font-thin text-white-100"
            >
              @{creatorId}
            </Link>
          </div>
        </div>
        <div className="flex items-start">
          <Button className="bg-trasparent text-start leading-[20px] h-[19px] bg-none p-0 text-pink-50 text-[18px] font-semibold">
            {/* // TODO: function to make the visitor of the page follow thew creator  */}
            {/* // TODO: function to flip the text content to following if the visitor is already a follower  */}
            Follow
          </Button>
        </div>
      </CardFooter>
      {/* </div> */}
      {/* <div className=" size-[120px] flex items-center justify-center">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Collection Image"
            className="size-[120px] object-cover rounded-lg"
            width={120}
            height={120}
          />
        )}
      </div> */}
    </Card>
  );
};

export default CreatorCard;

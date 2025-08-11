import { FC } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface CardProps {
  jsonUrl: string;
  publicKey: string;
  name: string;
}

const CollectionCard: FC<CardProps> = ({ jsonUrl, publicKey, name }) => {
  const { data } = useQuery({
    queryFn: async () => {
      // const { data } = await axios.get(`${jsonUrl}/collection.json`);
      const { data } = await axios.get(`${jsonUrl}`);
      console.log(data);
      return data;
    },
    queryKey: ["url", jsonUrl],
    enabled: !!jsonUrl,
  });

  if (data?.image == "") {
    return <></>;
  }

  return (
    <Card className="flex w-[261px] p-4 h-[152px] border-0 justify-between items-center bg-white-4">
      <div className="w-[94px] h-[97px] flex flex-col justify-between">
        <CardContent className=" p-0">
          <h3 className="text-[15px] font-semibold text-white-100 line-clamp-2 overflow-ellipsis">
            {name}
          </h3>
        </CardContent>
        <CardFooter className="p-0">
          <Link
            href={`/store/${publicKey}`}
            className=" bg-white-8 text-white-100 rounded-md py-2 px-4 w-[92px] hover:bg-white-4"
          >
            <p className="text-[18px] text-center">View</p>
          </Link>
        </CardFooter>
      </div>
      <div className=" size-[120px] flex items-center justify-center">
        {data?.image && (
          <Image
            src={data?.image}
            alt="Collection Image"
            className="size-[120px] object-cover rounded-lg"
            width={120}
            height={120}
          />
        )}
      </div>
    </Card>
  );
};

export default CollectionCard;

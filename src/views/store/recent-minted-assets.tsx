"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MintedAssetsProps {
  metadata: string;
}

export default function RecentMintedAssets({ metadata }: MintedAssetsProps) {
  const { data } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(metadata);
      return data;
    },
    queryKey: ["asset", metadata],
    enabled: !!metadata,
  });

  return (
    <div className="basis-[16.50%] p-4 flex flex-col gap-4 rounded-2xl bg-white-4 justify-between">
      <div className="w-full flex items-center justify-center">
        <div className={cn(`size-[160px] rounded-3xl relative`)}>
          {data?.image && (
            <Image
              src={data?.image}
              alt={data?.image}
              fill
              className="object-cover size-[120px] rounded-2xl"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className={cn("ty-title text-white-100 text-center")}>
          {data?.name}
        </p>
      </div>
    </div>
  );
}

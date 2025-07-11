"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Papa from "papaparse";
import { ASSETS_URL } from "@/constants";
import { Switch } from "@/components/ui/switch";
import { FormLabel } from "@/components/ui/form";
import { useStore } from "@/store/store";
import { TooltipContext } from "@/components/tooltip";

interface IUploadWalletsProps {
  className?: string;
}

export default function UploadWallets({ className }: IUploadWalletsProps) {
  // to be stored here
  const { setCreateUploadedCsv } = useStore();
  const [addressCount, setAddressCount] = useState(0);
  const [wallets, setWallets] = useState<string[]>([]);

  const handleDrop = (files: File[]) => {
    const json = files.filter((file) => {
      return file.type.startsWith("application/json");
    });

    const handleCsvFile = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const result = e.target?.result;
            if (typeof result === "string") {
              Papa.parse(result, {
                complete: (parsedData: any) => {
                  console.log("parsedData", parsedData);
                  const addresses: string[] = [];
                  parsedData.data.forEach((row: any[]) => {
                    const address = row[0]?.toString().trim();
                    if (address && addresses.length < 10000) {
                      addresses.push(address);
                    }
                  });
                  setWallets(addresses);
                  setAddressCount(addresses.length);
                  resolve({ fileName: file.name, data: addresses });
                },
                header: false,
              });
            }
          } catch (error) {
            reject(
              new Error(`Invalid CSV file: ${file.name} \n Error: ${error}`)
            );
          }
        };
        reader.onerror = () =>
          reject(new Error(`Error reading file: ${file.name}`));
        reader.readAsText(file);
      });
    };

    const csvFiles = files.filter((file) => file.type === "text/csv");

    Promise.all(csvFiles.map(handleCsvFile))
      .then((parsedFiles: any) => {
        console.log("Parsed CSV Files:", parsedFiles[0].data);
        setCreateUploadedCsv(parsedFiles[0].data);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "application/json": [".json"],
      "text/csv": [".csv"],
    },
    multiple: true,
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-1 ">
          <Switch />
          <FormLabel
            className={cn(
              "flex justify-center items-center text-white-100 ty-descriptions"
            )}
          >
            <p>Allow list</p>
            <div className="ms-1 flex h-full items-center justify-center">
              <TooltipContext
                trigger={
                  <Image
                    width={14}
                    height={14}
                    alt="hepl icon"
                    src={ASSETS_URL + "icons/help-circle.svg"}
                  />
                }
                description="Allow list"
              />
            </div>
          </FormLabel>
        </div>
        {addressCount > 0 && (
          <div className="text-sm text-white-50 flex justify-center items-center">
            <p>Addresses ({addressCount})</p>
            {addressCount > 10000 && (
              <p className="text-pink-50">Warning: Exceeded 10,000 wallets!</p>
            )}
          </div>
        )}
      </div>

      <div
        {...getRootProps()}
        className={cn(
          `flex flex-col ps-2 items-start justify-center w-full border-2 border-dashed rounded-lg shadow-lg transition cursor-pointer min-h-[32px] ${
            isDragActive
              ? "border-blue-500 bg-blue-100"
              : "border-white-4 bg-white-4"
          }`,
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex items-center space-x-2">
          <Image src="/images/upload.png" alt="upload" width={16} height={16} />
          <p className="text-sm font-medium text-gray-500">
            {isDragActive
              ? "Drop files here..."
              : "Click here or Drag and Drop your (csv) lists"}
          </p>
        </div>
      </div>
    </div>
  );
}

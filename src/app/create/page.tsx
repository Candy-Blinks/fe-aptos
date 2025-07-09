"use client";

import React from "react";

import Navbar from "@/components/navbar";
import CollectionInformationForm from "@/views/create/collection-information-form";
import UploadForm from "@/views/create/upload-form";
import Footer from "@/components/footer";
import FormStepper from "@/views/create/form-stepper";
import { useStore } from "@/store/store";
import {
  CollectionInformationSchema,
  CollectionInformationSchemaDefaults,
  ICollectionInformationSchema,
} from "@/lib/schemas/create_launchpad.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import CollectionOverview from "@/views/create/collection-overview";
import NoWallet from "@/components/no-wallet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Create() {
  const { createPage } = useStore();
  const { connected } = useWallet();

  const methods = useForm<ICollectionInformationSchema>({
    mode: "onSubmit", 
    resolver: zodResolver(CollectionInformationSchema),
    defaultValues: {
      ...CollectionInformationSchemaDefaults,
    },
  });

  if (!connected) {
    return (
      <>
        <NoWallet />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex items-start justify-center min-h-dvh mt-10">
        <div className="max-w-[1280px] w-full flex flex-col gap-8">
          <div className="w-full gap-4 flex justify-between">
            <div className="w-full max-w-[330px]">
              <FormStepper />
            </div>

            <FormProvider {...methods}>
              {createPage === 0 && <CollectionInformationForm />}
              {createPage === 1 && <UploadForm />}
              {createPage === 2 && <CollectionOverview />}
            </FormProvider>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

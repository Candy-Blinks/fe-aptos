"use client";
import React from "react";
import { cn, formatUnixTimestamp } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { IPhaseEditorSchema } from "@/lib/schemas/edit_phase.schema";
import Image from "next/image";
import { ASSETS_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function CurrentPhases() {
  const form = useFormContext<IPhaseEditorSchema>();

  return (
    <div className="basis-[49.50%] flex flex-col gap-4 h-full max-h-[480px] overflow-auto z-40">
      <div className="flex flex-col pt-1 gap-1">
        <p className={cn("text-white-100 ty-title")}>Select phase</p>
        <p className={cn("text-white-50 ty-subtext")}>Select phases to edit.</p>
      </div>

      {form.watch("phases").length === 0 && (
        <div className="w-full border border-white-4 flex justify-center p-4">
          <p className={cn("text-white-100 ty-descriptions")}>No phases yet</p>
        </div>
      )}

      {form.watch("phases").length > 0 && (
        <div className="flex flex-col gap-4">
          {form.watch("phases").map((phase, index) => {
            return (
              <div
                onClick={() => {
                  form.setValue("editPhaseFormId", index);
                  form.setValue("editPhaseForm", phase);
                }}
                key={phase.label}
                className={cn(
                  "p-4 flex flex-col gap-[10px] bg-white-4 rounded-[8px]",
                  form.watch("editPhaseFormId") == index && "border border-pink-100",
                )}
              >
                <div className="w-full flex items-center justify-between ">
                  <p className={"ty-descriptions text-white-100"}>{phase.label}</p>
                  <Button className="flex items-center rouned-[4px] gap-4 bg-black-100">
                    <p className={cn("ty-title text-white-80")}>Edit</p>
                  </Button>
                </div>

                <div className="w-full flex flex-col gap-2 p-4 bg-white-8  rounded-[8px]">
                  {(phase.startDate.enabled || phase.endDate.enabled) && (
                    <div className="flex gap-2">
                      <div className="p-1">
                        <Image
                          src={`${ASSETS_URL}icons/calendar.svg`}
                          width={16}
                          height={16}
                          alt="callendar icon"
                          className="text-white-100"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        {phase.startDate?.timestamp && phase.startDate?.enabled && (
                          <p className={"ty-subtitle text-white-100"}>
                            Start: {formatUnixTimestamp(Math.floor(phase.startDate?.timestamp?.getTime() / 1000))}
                          </p>
                        )}

                        {phase.endDate?.timestamp && phase.endDate?.enabled && (
                          <p className={"ty-subtitle text-white-100"}>
                            End: {formatUnixTimestamp(Math.floor(phase.endDate?.timestamp?.getTime() / 1000))}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {phase.mintLimit.enabled && (
                    <div className="flex gap-2">
                      <div className="p-1">
                        <Image
                          src={`${ASSETS_URL}icons/wallet-04.svg`}
                          width={16}
                          height={16}
                          alt="wallet icon"
                          className="text-white-100"
                        />
                      </div>

                      <p className={"ty-subtitle text-white-100"}>{phase.mintLimit?.limit ?? "Error"} per wallet</p>
                    </div>
                  )}

                  {phase.allocation.enabled && (
                    <div className="flex gap-2">
                      <div className="p-1">
                        <Image
                          src={`${ASSETS_URL}icons/store.svg`}
                          width={16}
                          height={16}
                          alt="store icon"
                          className="text-white-100"
                        />
                      </div>

                      <p className={"ty-subtitle text-white-100"}>
                        {phase.allocation?.limit ?? "Error"} max allocation
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="p-1">
                      <Image
                        src={`${ASSETS_URL}icons/solana.svg`}
                        width={16}
                        height={16}
                        alt="solana icon"
                        className="text-white-100"
                      />
                    </div>

                    {phase.aptosPayment.enabled ? (
                      <p className={"ty-subtitle text-white-100"}>{phase.aptosPayment.amount} SOL</p>
                    ) : (
                      <p className={"ty-subtitle text-white-100"}> Free</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <div className="p-1">
                      <Image
                        src={`${ASSETS_URL}icons/shield-user.svg`}
                        width={16}
                        height={16}
                        alt="shield user icon"
                        className="text-white-100"
                      />
                    </div>
                    <p className={"ty-subtitle text-white-100"}>10,000 wallets</p>
                    <p>Not done</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

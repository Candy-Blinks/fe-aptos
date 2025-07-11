"use client";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/store";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { useFormContext } from "react-hook-form";
import { IPhaseEditorSchema } from "@/lib/schemas/edit_phase.schema";

// Aptos constants
const OCTAS_PER_APT = 100_000_000; // 1 APT = 100,000,000 Octas

export default function NewChanges() {
  const { hubCandyStore, hubCollection, hubPhases } = useStore();
  // const { signAndSubmitTransaction } = useWallet(); // TODO: Use when implementing actual transaction

  const form = useFormContext<IPhaseEditorSchema>();

  // TODO: Replace with Aptos-specific phase update hook
  // const { updatePhases } = useAptosLaunchpadProgram();

  const newChanges = useMemo(() => {
    if (form.watch("phases").length != hubPhases.length) {
      return true;
    }

    for (const hubPhase of hubPhases) {
      const tempPhase = form
        .watch("phases")
        .find((field) => field.label == hubPhase.label);

      if (!tempPhase) {
        return true;
      }
    }

    return false;
  }, [form.watch("phases"), hubPhases]);
  const onSave = async () => {
    // Check for duplicate phase labels
    if (
      [
        ...new Set<string>([
          ...form.getValues("phases").map((phase) => phase.label),
        ]),
      ].length != form.getValues("phases").map((phase) => phase.label).length
    ) {
      console.log("Same Labels");
      return;
    }

    const tempPhases: any[] = [];

    for (const phase of form.getValues("phases")) {
      let tempPhase: any = {
        label: phase.label,
        startDate: null,
        endDate: null,
        aptosPayment: null, // Changed from solPayment to aptosPayment
        allocation: null,
        mintLimit: null,
        allowList: null,
      };

      if (phase.startDate.enabled) {
        const startDate = phase.startDate.timestamp?.getTime() ?? Date.now();
        tempPhase = {
          ...tempPhase,
          startDate: {
            timestamp: Math.floor(startDate / 1000), // Use regular number instead of BN
          },
        };
      }

      if (phase.endDate.enabled) {
        const endDate = phase.endDate.timestamp?.getTime() ?? Date.now();
        tempPhase = {
          ...tempPhase,
          endDate: {
            timestamp: Math.floor(endDate / 1000), // Use regular number instead of BN
          },
        };
      }

      if (phase.mintLimit.enabled) {
        tempPhase = {
          ...tempPhase,
          mintLimit: {
            // TODO: Check if ID is already created
            id: 1, // Use regular number instead of BN
            limit: phase.mintLimit.limit,
          },
        };
      }

      if (phase.allocation.enabled) {
        tempPhase = {
          ...tempPhase,
          allocation: {
            // TODO: Check if ID is already created
            id: 1, // Use regular number instead of BN
            limit: phase.allocation.limit,
          },
        };
      }

      // Use aptosPayment instead of solPayment
      if (phase.aptosPayment.enabled) {
        console.log("Aptos Payment", Number(phase.aptosPayment.amount ?? 0));
        console.log(
          "Aptos Payment in Octas",
          (Number(phase.aptosPayment.amount ?? 0) * OCTAS_PER_APT).toFixed(0)
        );

        tempPhase = {
          ...tempPhase,
          aptosPayment: {
            user: AccountAddress.fromString(phase.aptosPayment.user!),
            amount: Number(
              (Number(phase.aptosPayment.amount ?? 0) * OCTAS_PER_APT).toFixed(0)
            ),
          },
        };
      }

      tempPhases.push(tempPhase);
    }

    if (hubCandyStore && hubCollection) {
      // TODO: Implement Aptos transaction for updating phases
      try {
        console.log("Updating phases on Aptos:", tempPhases);
        console.log("Candy Store:", hubCandyStore);
        console.log("Collection:", hubCollection);

        // Example Aptos transaction structure:
        // const transaction = {
        //   data: {
        //     function: `${MODULE_ADDRESS}::candy_store::update_phases`,
        //     arguments: [hubCollection, tempPhases],
        //   },
        // };

        // const response = await signAndSubmitTransaction(transaction);
        // console.log("Phases updated successfully:", response);

        console.log("Phase update logic needs to be implemented for Aptos");
      } catch (error) {
        console.error("Failed to update phases:", error);
      }
    }
  };
  return (
    <>
      {newChanges && (
        <div className="w-full flex items-center rounded-[8px] justify-between p-4 border border-white-12">
          <p className={cn("ty-descriptions text-white-100 bg-transparent")}>
            You have unsave changes!
          </p>

          <div className="flex items-center gap-1">
            <Button
              className={cn("ty-title text-white-100 bg-transparent")}
              onClick={() => {
                form.setValue("phases", hubPhases);
              }}
            >
              Reset
            </Button>
            <Button
              className={cn("ty-title text-white-100 bg-pink-100")}
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

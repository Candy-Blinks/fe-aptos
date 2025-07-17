function disclaimer() {
  return (
    <div>disclaimer</div>
  )
}

export default disclaimer

// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   DisclaimerSchema,
//   IDisclaimerSchema,
// } from "@/lib/schemas/onboarding.schema";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form";
// import { cn } from "@/lib/utils";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { useStore } from "@/store/store";
// import { Checkbox } from "@/components/ui/checkbox";
// import { API_URL } from "@/lib/constants";

// export default function Disclaimer() {
//   const { setOnboardingPageNumber, onboardingPageNumber, onboardingPayload } =
//     useStore();

//   const form = useForm<IDisclaimerSchema>({
//     resolver: zodResolver(DisclaimerSchema),
//     defaultValues: {
//       agreed: false,
//     },
//   });

//   const {
//     mutate: createUser,
//     data: users,
//     isSuccess: createUserIsSuccess,
//   } = useMutation({
//     mutationFn: async ({
//       address,
//       username,
//       referralCode,
//       profilePic,
//     }: any) => {
//       console.log({
//         address,
//         username,
//         referralCode,
//         profilePic,
//       });

//       const {
//         data: { data },
//       } = await axios.post(`${API_URL}users`, {
//         address: address,
//         username,
//         referralCode,
//         profilePic,
//       });

//       return data;
//     },
//   });

//   useEffect(() => {
//     if (createUserIsSuccess) {
//       setOnboardingPageNumber(onboardingPageNumber + 1);
//     }
//   }, [users, createUserIsSuccess]);

//   const onCreateUser = () => {
//     createUser({
//       referralCode: onboardingPayload.referralCode,
//       address: onboardingPayload.address,
//       username: onboardingPayload.username,
//       profilePic: "",
//     });
//   };

//   return (
//     <>
//       <p className="subheading text-center uppercase text-white-100">
//         Disclaimer
//       </p>
//       <div className="flex w-full flex-col gap-2 overflow-auto rounded-md p-4">
//         <p className="text-center text-white-80">
//           By using CorePlay, you acknowledge that blockchain transactions are
//           final and irreversible.
//         </p>
//         <p className="text-center text-white-80">
//           Users are responsible for their own assets and in-game actions. You
//           must be at least 18 years old and legally allowed to participate.
//         </p>
//       </div>
//       <Form {...form}>
//         <div className="flex w-full items-center justify-center">
//           <FormField
//             control={form.control}
//             name="agreed"
//             render={({ field }) => (
//               <FormItem
//                 className={cn(
//                   `flex w-fit items-center justify-center gap-2 rounded-[6px] px-2 py-4 transition-colors duration-300`,
//                   form.watch("agreed")
//                     ? "bg-white-100"
//                     : "bg-black-50 ring-1 ring-white-80",
//                 )}
//               >
//                 <FormControl>
//                   <Checkbox
//                     className="h-5 w-5 cursor-pointer appearance-none border border-black-100 bg-white-100 checked:bg-black-100 checked:text-white-100"
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>

//                 <FormLabel
//                   className={cn(
//                     `whitespace-nowrap text-sm transition-colors duration-300 ${
//                       form.watch("agreed") ? "text-black-100" : "text-white-100"
//                     }`,
//                   )}
//                 >
//                   I agree
//                 </FormLabel>
//               </FormItem>
//             )}
//           />
//         </div>
//       </Form>

//       <Button
//         disabled={!form.watch("agreed")}
//         onClick={onCreateUser}
//         className={cn("text-[20px] uppercase font-semibold h-[82px] w-full bg-pink-50 text-white-100 hover:bg-pink-80")}
//       >
//         Accept & Finish
//       </Button>
//     </>
//   );
// }

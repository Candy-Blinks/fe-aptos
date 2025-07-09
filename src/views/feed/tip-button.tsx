import Image from "next/image";

export default function TipButton({
  currency,
  amount,
  icon,
}: {
  currency: string;
  amount: string;
  icon: string;
}) {
  // TODO: make a type for currency
  // TODO: make function on click that will give tip to the auithor of the article
  // TODO: make a type make a normmalization function for the amount from number into decimal 2 positions

  return (
    <div className=" hover:bg-white-8                         cursor-pointer                        flex w-fit rounded-[8px] p-2 items-center bg-white-4 justify-between gap-[10px] h-[32px]">
      <figure className="size-[24px]">
        <Image
          src={icon}
          alt="solana icon"
          width={24}
          height={24}
          priority
          className="object-contain  size-[24px]"
        />
      </figure>
      <p className=" whitespace-nowrap">
        {currency} {amount}
      </p>
    </div>
  );
}

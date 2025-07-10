import { useState, useEffect } from "react";
import { getCountdownTime, CountdownTime } from "@/lib/utils";

export interface CountdownProps {
  unixTimestamp: number;
}

export function Countdown({ unixTimestamp }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(getCountdownTime(unixTimestamp));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(getCountdownTime(unixTimestamp));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [unixTimestamp]);

  return (
    <span className="font-semibold text-[18px]">
      {timeLeft.isComplete
        ? "Time's up!"
        : `${timeLeft.days}:${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
    </span>
  );
}

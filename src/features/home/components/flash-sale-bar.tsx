"use client";

import { Zap } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

export function FlashSaleBar() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 12,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Timer reached zero
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const padTime = (num: number) => String(num).padStart(2, "0");

  return (
    <div
      className={cn(
        "via-brand-700 to-brand-500 w-full bg-gradient-to-r from-neutral-900",
        "px-4 py-3 sm:px-6 lg:px-8",
        "flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6",
      )}
    >
      {/* Left Side - Flash Sale Text */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Zap
          className="h-5 w-5 flex-shrink-0 text-white sm:h-6 sm:w-6"
          strokeWidth={3}
        />
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-sm font-bold text-white sm:text-base">
            FLASH SALE CUỐI TUẦN
          </h2>
          <p className="font-sans text-xs text-white/80 sm:text-sm">
            Giảm đến 50% cho tất cả sản phẩm chăm sóc da
          </p>
        </div>
      </div>

      {/* Right Side - Countdown Timer */}
      <div className="flex items-center gap-2 whitespace-nowrap sm:gap-3">
        <span className="font-sans text-xs font-semibold text-white/90 sm:text-sm">
          KẾT THÚC TRONG:
        </span>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Hours */}
          <div className="rounded-lg bg-white/20 px-2 py-1 text-sm font-bold text-white sm:px-3 sm:text-base">
            {padTime(timeLeft.hours)}
          </div>
          <span className="text-sm font-bold text-white/80 sm:text-base">
            :
          </span>

          {/* Minutes */}
          <div className="rounded-lg bg-white/20 px-2 py-1 text-sm font-bold text-white sm:px-3 sm:text-base">
            {padTime(timeLeft.minutes)}
          </div>
          <span className="text-sm font-bold text-white/80 sm:text-base">
            :
          </span>

          {/* Seconds */}
          <div className="rounded-lg bg-white/20 px-2 py-1 text-sm font-bold text-white sm:px-3 sm:text-base">
            {padTime(timeLeft.seconds)}
          </div>
        </div>
      </div>
    </div>
  );
}

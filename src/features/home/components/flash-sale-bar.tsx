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
    <div className={cn(
      "w-full bg-gradient-to-r from-neutral-900 via-brand-700 to-brand-500",
      "py-3 px-4 sm:px-6 lg:px-8",
      "flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6"
    )}>
      {/* Left Side - Flash Sale Text */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" strokeWidth={3} />
        <div className="flex flex-col gap-1">
          <h2 className="text-sm sm:text-base font-bold text-white font-serif">
            FLASH SALE CUỐI TUẦN
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-sans">
            Giảm đến 50% cho tất cả sản phẩm chăm sóc da
          </p>
        </div>
      </div>

      {/* Right Side - Countdown Timer */}
      <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
        <span className="text-xs sm:text-sm text-white/90 font-sans font-semibold">
          KẾT THÚC TRONG:
        </span>
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Hours */}
          <div className="bg-white/20 rounded-lg px-2 sm:px-3 py-1 text-white font-bold text-sm sm:text-base">
            {padTime(timeLeft.hours)}
          </div>
          <span className="text-white/80 font-bold text-sm sm:text-base">:</span>

          {/* Minutes */}
          <div className="bg-white/20 rounded-lg px-2 sm:px-3 py-1 text-white font-bold text-sm sm:text-base">
            {padTime(timeLeft.minutes)}
          </div>
          <span className="text-white/80 font-bold text-sm sm:text-base">:</span>

          {/* Seconds */}
          <div className="bg-white/20 rounded-lg px-2 sm:px-3 py-1 text-white font-bold text-sm sm:text-base">
            {padTime(timeLeft.seconds)}
          </div>
        </div>
      </div>
    </div>
  );
}

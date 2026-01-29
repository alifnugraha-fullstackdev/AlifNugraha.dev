"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import LiveryStationSign from "#/static/images/assets/blog/livery-krl-station-sign.svg";
import { cn } from "@/lib/utils";

export function LiveryKRL({
  transportation,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  transportation: {
    stationName: string;
    liveryStationName: string;
    liveryStationHeight: number;
  };
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const updateScale = () => {
      const img = imgRef.current;
      if (!img) return;

      const actualWidth = img.offsetWidth;
      img.style.setProperty("--livery-width", actualWidth.toString());
      img.parentElement?.style.setProperty(
        "--livery-scale",
        (actualWidth / 468.76).toString(),
      );
    };

    // Initial update
    updateScale();

    // Create ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    if (imgRef.current) {
      resizeObserver.observe(imgRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={cn("not-prose relative flex", className)} {...props}>
      <div
        className="absolute top-[20%] left-[4.5%] z-50 flex origin-top-left flex-col font-inter text-[#02106D]"
        style={{
          transform: "scale(var(--livery-scale, 1))",
          fontSize: "30px",
        }}
      >
        <p className="truncate font-extrabold text-[0.9em] leading-tight">
          {transportation.liveryStationName}
        </p>
        <p className="font-bold text-[0.6em] leading-tight">
          + {transportation.liveryStationHeight} M
        </p>
      </div>
      <Image
        ref={imgRef}
        src={LiveryStationSign}
        alt="Livery Station Sign"
        width={468.76}
        height={100}
        className="z-0 h-auto w-full"
        style={{
          ["--livery-scale" as any]:
            "calc(var(--livery-width, 468.76) / 468.76)",
        }}
      />
    </div>
  );
}

"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr/immutable";
import { CloudflareImage } from "@/components/image";
import { PlusSeparator } from "@/components/ui/plus-separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { wakaTimeData } from "@/lib/actions/wakatime";
import { cn } from "@/lib/utils";

const SkillsSection = dynamic(() => import("./about-skills"), { ssr: false });

export default function AboutSection({
  aboutBio,
  birthDate,
  aboutHelloImage,
}: {
  aboutBio?: string;
  birthDate?: string;
  aboutHelloImage?: string;
}) {
  const wakatimeStats = useSWR("wakatime", wakaTimeData);
  const bd = birthDate ? new Date(birthDate) : new Date("2010-08-02T00:00:00+07:00");
  const [age, setAge] = useState(ageCalc(bd));

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(ageCalc(bd));
    }, 75);

    return () => clearInterval(interval);
  }, [bd]);

  return (
    <>
      <main className="w-full border-separator/10 border-t">
        <div className="inner relative flex h-full flex-col border-separator/10 border-x px-2 text-sm sm:px-4 sm:text-base xl:flex-row xl:justify-between xl:px-8">
          <div className="py-24 xl:max-w-7/11">
            <img
              src={aboutHelloImage || "/hello_typography.png"}
              alt="hello."
              height={60}
              className="pointer-events-none -mt-5 mb-4 aspect-auto h-[60px] object-contain select-none [image-rendering:pixelated] dark:invert"
              // Removed fetchPriority for generic img
            />
            <div className="space-y-4">
              {(
                aboutBio ||
                "My name is Alif Nugraha. I am a self-taught Software Engineer with a deep passion for building impactful digital solutions. (Currently {age} years old)\n\nif you're curious, i started coding when i was 11. at the time, i was bored of just playing minecraft every day, chatting with my friends, sitting at the chair at all times. so i began exploring discord bot templates. i wondered, \"what if i could make one myself?\" and that's what inspired me to start coding. since then, i've invested over {wakatime} hours into coding, brainstorming, and even struggling through bugs that seemed impossible to fix."
              )
                .split("\n")
                .map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph.split(/({age}|{wakatime})/g).map((part, i) => {
                      if (part === "{age}") {
                        return (
                          <Tooltip key={i}>
                            <TooltipTrigger className="underline decoration-dashed">
                              {Math.floor(age)}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{age.toFixed(9)}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }
                      if (part === "{wakatime}") {
                        return (
                          <Tooltip key={i} open={wakatimeStats.isLoading ? false : undefined}>
                            <TooltipTrigger
                              className={cn(
                                "cursor-pointer underline decoration-dashed",
                                wakatimeStats.isLoading && "animate-pulse rounded-md bg-accent text-accent"
                              )}
                              onClick={() => {
                                window.open("https://wakatime.com/@alifnugraha", "_blank");
                              }}
                            >
                              {wakatimeStats.isLoading
                                ? "xxxx"
                                : (Math.floor((wakatimeStats.data?.total_seconds || 0) / 60 / 60) / 1000).toFixed(3)}
                              <span className="sr-only">WakaTime profile</span>
                            </TooltipTrigger>
                            <TooltipContent className="text-center">
                              <p>{wakatimeStats.data?.human_readable_total}</p>
                              <p>Click to open my Wakatime Account</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </p>
                ))}
            </div>
          </div>
          <div className="relative mx-auto mb-2 flex w-full max-w-sm items-center justify-center md:mb-6 lg:mb-12 xl:mb-0">
            <div className="flex flex-col justify-between rounded-xs border bg-muted/50 p-4 shadow-sm dark:bg-muted/20">
              <h2 className="font-semibold text-lg">philosophy</h2>
              <p className="mt-1 leading-tight">
                I’d rather ship slow and solid than fast and fragile. Every
                project is an opportunity to build something that feels precise,
                calm, and durable, not just “done.”
              </p>
              <Link
                href="/about"
                className="mt-2 font-mono text-blue-600 text-sm hover:underline dark:text-blue-400"
              >
                [/about]
              </Link>
            </div>
          </div>
          <PlusSeparator position={["top-left", "top-right"]} />
        </div>
      </main>

      <SkillsSection />
    </>
  );
}

export function ageCalc(customDate?: Date) {
  const birthDate = customDate || new Date("2010-08-02T00:00:00+07:00");
  const now = new Date();

  const ageInMilliseconds = now.getTime() - birthDate.getTime();
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return ageInYears;
}

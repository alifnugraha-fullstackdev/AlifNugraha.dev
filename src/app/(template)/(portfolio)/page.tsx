import Script from "next/script";
import { PlusSeparator } from "@/components/ui/plus-separator";
import AboutSection from "./about";
import HeroSection from "./hero";
import ProjectSection from "./projects";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectSection />
        <main className="w-full border-separator/10 border-t">
          <div className="inner relative flex h-24 border-separator/10 border-x">
            <PlusSeparator position={["top-left", "top-right"]} />
          </div>
        </main>
      </main>
      <Script src="https://pagering.gideon.sh/embed.js" defer />
    </>
  );
}

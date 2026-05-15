import Script from "next/script";
import { PlusSeparator } from "@/components/ui/plus-separator";
import AboutSection from "./about";
import HeroSection from "./hero";
import ProjectSection from "./projects";
import { getCachedSiteSettings, getCachedProjects } from "@/lib/data";

export default async function Home() {
  const settings = await getCachedSiteSettings();
  const projects = await getCachedProjects();

  return (
    <>
      <main>
        <HeroSection
          heroName={settings.hero_name || "hey, i'm Alif Nugraha 👋"}
          heroSubtitle={settings.hero_subtitle || "a self-taught software engineer with a strong foundation in full-stack development, driven by a passion for building impactful solutions."}
          heroQuote={settings.hero_quote || "\"a journey that began as a hobby and evolved into a deep commitment to technology and problem-solving.\""}
        />
        <AboutSection
          aboutBio={settings.about_bio || "My name is Alif Nugraha. I am a self-taught Software Engineer with a deep passion for building impactful digital solutions."}
          aboutHelloImage={settings.about_hello_image || "/hello_typography.png"}
        />
        <ProjectSection projects={projects} />
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

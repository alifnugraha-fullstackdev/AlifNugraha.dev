import Footer from "@/components/portfolio/navigation/footer";
import Navbar from "@/components/portfolio/navigation/navbar";
import { SmoothCursor } from "@/labs-registry/components-v1/smooth-cursor";
import { getCachedSocialLinks } from "@/lib/data";
import { Link as LinkIcon } from "lucide-react";
import { socials as defaultSocials } from "@/constants/navigation/footer";
import { HideOnAdmin, AdminAwareWrapper } from "@/components/hide-on-admin";

export default async function RootTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dbSocials = await getCachedSocialLinks();
  
  const mappedSocials = dbSocials.map((s: any) => ({
    name: s.platform || s.name,
    href: s.url || s.href,
    iconName: s.iconName || (s.icon?.name) || "Link",
    iconUrl: s.iconUrl || null,
  }));

  return (
    <>
      <HideOnAdmin>
        <Navbar />
      </HideOnAdmin>
      <AdminAwareWrapper>{children}</AdminAwareWrapper>
      <HideOnAdmin>
        <Footer socials={mappedSocials} />
        <SmoothCursor disableRotation />
      </HideOnAdmin>
    </>
  );
}

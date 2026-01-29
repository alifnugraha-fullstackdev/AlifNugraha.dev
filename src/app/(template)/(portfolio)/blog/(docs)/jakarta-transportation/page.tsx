import { Suspense } from "react";
// MDX content imports
import IndexContent from "@/content/blog/jakarta-transportation/index.mdx";
import KrlBogor from "@/content/blog/jakarta-transportation/krl-bogor.mdx";
import KrlCikarangLoop from "@/content/blog/jakarta-transportation/krl-cikarang-loop.mdx";
import KrlRangkasbitung from "@/content/blog/jakarta-transportation/krl-rangkasbitung.mdx";
import KrlTangerang from "@/content/blog/jakarta-transportation/krl-tangerang.mdx";
import KrlTanjungPriok from "@/content/blog/jakarta-transportation/krl-tanjung-priok.mdx";
import MrtEastWest3 from "@/content/blog/jakarta-transportation/mrt-east-west-3.mdx";
import MrtNorthSouth1 from "@/content/blog/jakarta-transportation/mrt-north-south-1.mdx";
import MrtNorthSouth2a from "@/content/blog/jakarta-transportation/mrt-north-south-2a.mdx";
import MrtNorthSouth2b from "@/content/blog/jakarta-transportation/mrt-north-south-2b.mdx";
import { JakartaTransportBlogTemplate } from "./blog.template";
import { JakartaTransportMapClient } from "./page.client";
import { TransportInformationTable } from "./table.component";

const mdxComponents: Record<string, React.ComponentType> = {
  "": IndexContent,
  "krl-rangkasbitung": KrlRangkasbitung,
  "krl-cikarang-loop": KrlCikarangLoop,
  "krl-bogor": KrlBogor,
  "krl-tangerang": KrlTangerang,
  "krl-tanjung-priok": KrlTanjungPriok,
  "mrt-north-south-1": MrtNorthSouth1,
  "mrt-north-south-2a": MrtNorthSouth2a,
  "mrt-north-south-2b": MrtNorthSouth2b,
  "mrt-east-west-3": MrtEastWest3,
};

// Pre-render all content with templates
const contentMap: Record<string, React.ReactNode> = Object.entries(
  mdxComponents,
).reduce(
  (acc, [key, Component]) => {
    acc[key] = (
      <JakartaTransportBlogTemplate
        className="prose-sm mx-auto max-w-3xl pb-8"
        currentLine={key}
        components={{
          TransportInformationTable,
          default: Component,
        }}
      />
    );
    return acc;
  },
  {} as Record<string, React.ReactNode>,
);

export default function JakartaTransportMapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <JakartaTransportMapClient contentMap={contentMap} />
    </Suspense>
  );
}

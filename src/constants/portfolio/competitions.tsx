import { Home, Video } from "lucide-react";
import type { ComponentProps } from "react";
import type { Badge } from "@/components/ui/badge";

export type Competition = {
  title: string;
  dates: string;
  location: string;
  description: string;
  image?: string;
  links?: Array<{
    title: string;
    href: string;
    icon: React.ReactNode;
    variant?: ComponentProps<typeof Badge>["variant"];
  }>;
  flags?: Array<string>;
};
export const competitions: Array<Competition> = [
  {
    title: "FIRST Tech Challange Nusantara Championship",
    dates: "February, 2026",
    location: "Depok, Indonesia",
    description:
      "FIRST Tech Challenge is a global robotics competition that inspires young people to become leaders in science and technology. The FTC DECODE Nusantara Championship is the Indonesian regional championship, where teams of students design, build, and program robots to compete in a series of challenges.",
    flags: ["winner:Winning Alliance", "winner:2nd Winner of Inspire Award"],
    image: "/static/images/competitions/ftc-decode-indonesia.png",
  },
  {
    title: "Daydream Jakarta",
    dates: "September, 2025",
    location: "Jakarta, Indonesia",
    description:
      "All-day game jams in Jakarta, where teens worked together to make amazing games, alongside events in 100+ other cities worldwide in a global event by Hack Club.",
    flags: ["committee"],
    image: "/static/images/competitions/daydream-jakarta.png",
    links: [
      {
        title: "Landing Page",
        href: "https://daydream.hackclub.com/jakarta",
        icon: <Home />,
      },
      {
        title: "Video Recap",
        href: "https://www.youtube.com/watch?v=vvdoW2gh9YU",
        icon: <Video />,
        variant: "secondary",
      },
    ],
  },
  {
    title: "Garuda Hacks 6.0",
    dates: "July, 2025",
    location: "Tangerang, Indonesia",
    description:
      "Southeast Asia's largest hackathon, empowering young Indonesians with the skills and motivation to solve the country's most urgent issues over an intense 30-hour coding marathon.",
    image: "/static/images/competitions/garudahacks-6.0.png",
    links: [
      {
        title: "Landing Page",
        href: "https://garudahacks.com/",
        icon: <Home />,
      },
    ],
  },
];

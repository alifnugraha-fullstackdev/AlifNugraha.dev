import { SiGithub, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { AtSign } from "lucide-react";

export const socials = [
  {
    name: "Email",
    href: "mailto:alifnugraha@gmail.com",
    icon: AtSign,
  },
  {
    name: "GitHub",
    href: "https://github.com/alifnugraha",
    icon: SiGithub,
  },
  {
    name: "X (Twitter)",
    href: "https://twitter.com/alifnugraha",
    icon: SiX,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/alifnugraha",
    icon: SiInstagram,
  },
];

export const pages = {
  personal: [
    { name: "blog", href: "/blog" },
    { name: "about me", href: "/about" },
    { name: "projects", href: "/projects" },
  ],
  explore: [
    { name: "home", href: "/" },
    { name: "labs", href: "/labs" },
    { name: "guestbook", href: "/guestbook" },
  ],
  meta: [
    { name: "sitemap", href: "/sitemap.xml" },
    { name: "attribute", href: "/attribute" },
  ],
};

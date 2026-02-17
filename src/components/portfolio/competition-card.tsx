import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Competition } from "@/constants/portfolio/competitions";

export function CompetitionCard({
  title,
  description,
  dates,
  location,
  image,
  links,
  flags,
}: Competition) {
  return (
    <li className="relative ml-10 py-4">
      <div className="absolute top-2 -left-16 flex items-center justify-center rounded-full bg-white">
        <Avatar className="m-auto size-12 border">
          <AvatarImage src={image} alt={title} className="object-contain" />
          <AvatarFallback>{title[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 text-sm sm:text-base">
        {dates && (
          <time className="text-muted-foreground text-xs">{dates}</time>
        )}
        <h2 className="flex items-center font-semibold leading-none">
          {title}
          {flags?.map((flag, idx) => {
            if (flag === "committee") {
              return (
                <Badge key={idx} variant="outline" className="ml-2">
                  Committee
                </Badge>
              );
            }

            const [type, value] = flag.split(":");
            if (type === "winner") {
              return (
                <Badge
                  key={idx}
                  className="ml-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black dark:from-amber-200 dark:to-amber-300"
                >
                  {value}
                </Badge>
              );
            }

            return null;
          })}
        </h2>
        {location && (
          <p className="text-muted-foreground text-xs sm:text-sm">{location}</p>
        )}
        {description && (
          <span className="prose dark:prose-invert text-muted-foreground text-xs sm:text-sm">
            {description}
          </span>
        )}
      </div>
      {links && links.length > 0 && (
        <div className="mt-2 flex flex-row flex-wrap items-start gap-2">
          {links?.map((link, idx) => (
            <Link href={link.href} target="_blank" key={idx}>
              <Badge
                key={idx}
                title={link.title}
                className="flex gap-2"
                variant={link.variant || "default"}
              >
                {link.icon}
                {link.title}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

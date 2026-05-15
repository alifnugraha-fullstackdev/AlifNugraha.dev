import { Feed } from "feed";
import { blog } from "@/lib/source";
import { NextResponse } from "next/server";

export const revalidate = false;

const baseUrl = "https://alifnugraha.my.id";

export function GET() {
  const feed = new Feed({
    title: "Alif Nugraha's Blog",
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: "en",

    image: `${baseUrl}/banner.png`,
    favicon: `${baseUrl}/icon.png`,
    copyright: "© 2025, Alif Nugraha. Licensed under CC BY-NC 4.0",
  });

  for (const page of blog.getPages().sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  })) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: new Date(page.data.date),

      author: [
        {
          name: page.data.author,
        },
      ],
    });
  }

  return new NextResponse(feed.rss2());
}

import { db } from "@/server/db";
import RSS from "rss";

export async function GET(
  request: Request,
  { params }: { params: { username: string } },
) {
  const username = params.username.slice(1);

  const user = await db.user.findFirst({
    where: { username },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  const feedOptions = {
    title: `${user.username}'s thought dump`,
    description: user.about ?? "A thought dump",
    site_url: "https://dump.place",
    feed_url: `https://dump.place/@${user.username}/rss.xml`,
    image_url: `https://dump.place/@${user.username}/pfp`,
    pubDate: new Date(),
  };

  const feed = new RSS(feedOptions);

  const posts = await db.dumps.findMany({
    where: { createdById: user.id, isPrivate: false },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  posts.forEach((post) => {
    feed.item({
      title: `${user.username}'s Dump #${post.id}`,
      description: post.content,
      url: `https://dump.place/@${user.username}?dump=${post.id}`,
      guid: `${post.id}`,
      date: post.createdAt,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}

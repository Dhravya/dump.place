import { db } from "@/server/db";
import RSS from "rss";

export async function GET(
  request: Request,
  { params }: { params: { username: string } },
) {
  const username = params.username.slice(1);

  const user = await db.user.findUnique({
    where: { name: username },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  const feedOptions = {
    title: `${user.name}'s thought dump`,
    description: user.about ?? "A thought dump",
    site_url: "https://dump.place",
    feed_url: `https://dump.place/@${user.name}/rss.xml`,
    image_url: `https://dump.place/@${user.name}/pfp`,
    pubDate: new Date(),
  };

  const feed = new RSS(feedOptions);

  const posts = await db.dumps.findMany({
    where: { createdById: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  posts.forEach((post) => {
    feed.item({
      title: `${user.name}'s Dump #${post.id}`,
      description: post.content,
      url: `https://dump.place/@${user.name}?dump=${post.id}`,
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

import { db } from "@/server/db";
import { revalidatePath } from "next/cache"; 'next/cache'

const cache: Record<string, string> = {};

export async function GET(
  request: Request,
  { params }: { params: { username: string } },
) {
  const username = params.username.slice(1);

  return new Response(JSON.stringify({ error: "User not found" }), {
    status: 404,
  });

  // Generate a number between 1 and 100. if it's 1, revalidate the cache
  // for this path.
  if (Math.floor(Math.random() * 100) === 1) {
    Object.keys(cache).forEach((key) => {
      if (key.startsWith(username)) {
        delete cache[key];
      }
    });
    revalidatePath(request.url);
  }

  if (cache[username]) {
    if (cache[username] === "notfound") {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        'Location': cache[username]!,
        'Cache-Control': "public, max-age=31536000, immutable",
      },
    });
  }

  const email = await db.user
    .findFirst({
      where: { username },
      select: { email: true },
    })
    .then((user) => user?.email);

  if (!email) {
    cache[username] = "notfound";
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }


  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const avatar = await fetch("https://unavatar.io/" + email + "?json=true", {
    next: {
      revalidate: 60 * 60 * 24,
    },
  })
    .then((res: Response) => res.json())
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    .then((json) => json.url);

  cache[username] = avatar as string;

  return new Response(null, {
    status: 302,
    headers: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      'Location': avatar,
      'Cache-Control': "public, max-age=31536000, immutable",
    },
  });
}

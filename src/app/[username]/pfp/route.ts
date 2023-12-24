import { db } from "@/server/db";

export async function GET(
  request: Request,
  { params }: { params: { username: string } },
) {
  const username = params.username.slice(1);

  const email = await db.user
    .findUnique({
      where: { name: username },
      select: { email: true },
    })
    .then((user) => user?.email);

  if (!email) {
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

  return new Response(null, {
    status: 302,
    headers: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Location: avatar,
    },
  });
}

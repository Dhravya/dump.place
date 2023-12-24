import { db } from "@/server/db";

export async function POST(
  request: Request,
  { params }: { params: { username: string } },
) {
  const username = params.username.slice(1);

  // read the body of the request
  const { password, content, isPublic } = (await request.json()) as {
    password: string;
    content: string;
    isPublic: boolean;
  };

  // check if the user exists
  const user = await db.user.findUnique({
    where: {
      name: username,
    },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  // check if the password is correct
  if (user.password !== password) {
    return new Response(JSON.stringify({ error: "Incorrect password." }), {
      status: 401,
    });
  }

  // create the post
  await db.dumps.create({
    data: {
      content,
      isPrivate: !isPublic,
      createdByName: user.name ?? "Anonymous",
      createdBy: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return new Response(JSON.stringify({ success: true }));
}

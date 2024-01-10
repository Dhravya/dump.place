import { db } from "@/server/db";
import { moderate } from "@/server/moderate";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  // read the body of the request
  const { password, content, username, isPublic } = (await request.json()) as {
    password: string;
    content: string;
    username: string;
    isPublic: boolean;
  };

  if (content.length > 700) {
    return new Response(
      JSON.stringify({ success: "", error: "Your post is too long." }),
      {
        status: 413,
      },
    );
  }

  // check if the user exists
  const user = await db.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ success: "", error: "User not found." }),
      {
        status: 404,
      },
    );
  }

  console.log(user);

  if (!user.password) {
    return new Response(
      JSON.stringify({ success: "", error: "User has no password." }),
      {
        status: 401,
      },
    );
  }

  // check if the password is correct
  if (user.password !== password) {
    return new Response(
      JSON.stringify({ success: "true", error: "Incorrect password." }),
      {
        status: 401,
      },
    );
  }

  const dumps = await db.dumps.findMany({
    where: {
      createdById: user.id,
      createdAt: {
        gt: new Date(Date.now() - 120000),
      },
    },
  });

  if (dumps.length >= 2) {
    return new Response(
      JSON.stringify({ success: "", error: "You are posting too fast." }),
      {
        status: 429,
      },
    );
  }

  const sameDump = dumps.find((d) => d.content === content);

  if (sameDump) {
    return new Response(
      JSON.stringify({ success: "", error: "You've already posted that." }),
      {
        status: 409,
      },
    );
  }


  const isValidDump =
    content.replaceAll("!", "")
      .replaceAll(" ", "")
      .replaceAll(/\n/g, "")
      .replaceAll(/\t/g, "")
      .replaceAll("*", "")
      .replaceAll("`", "")
      .replaceAll("#", "")
      .replaceAll("[", "")
      .replaceAll("]", "")
      .trim().length > 0;
  if (!isValidDump) {
    return new Response(
      JSON.stringify({ success: "", error: "Your post is empty." }),
      {
        status: 400,
      },
    );
  }

  // create the post
  await db.dumps.create({
    data: {
      content,
      isPrivate: !isPublic,
      createdByName: user.username ?? user.email?.split("@")[0] ?? "Anonymous",
      createdBy: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  revalidatePath(`/@${user.username}`);

  return new Response(JSON.stringify({ success: true }));
}

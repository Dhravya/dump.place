"use server";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { revalidatePath } from "next/cache";
import { moderate } from "@/server/moderate";
import { env } from "@/env";
import { ratelimit } from "@/lib/rate-limit";

export async function handleNameSubmit(
  name: string,
  about: string,
  password: string,
) {
  const auth = await getServerAuthSession();

  if (!auth) {
    return {
      status: 401,
      body: {
        error: "You must be logged in to do that.",
      },
    };
  }

  // username should be between 3 and 20 characters, should be lowercase and should not contain any special characters
  if (!/^[a-z0-9_]{3,20}$/.test(name)) {
    return {
      status: 400,
      body: {
        error:
          "Username should be between 3 and 20 characters, should be lowercase and should not contain any special characters.",
      },
    };
  }

  const checkAvailability = await db.user.findFirst({
    where: {
      username: name,
    },
  });

  if (checkAvailability && checkAvailability?.username !== auth.user.username) {
    return {
      status: 400,
      body: {
        error: "That name is already taken.",
      },
    };
  }

  const authuser = await db.user.findUnique({
    where: {
      id: auth.user.id,
    },
  });

  if (!authuser) {
    return {
      status: 404,
      body: {
        error: "Auth User not found.",
      },
    };
  }

  await db.user.update({
    where: {
      id: authuser.id,
    },
    data: {
      name,
      username: name.toLowerCase().replace(/ /g, "-"),
      about,
      password,
    },
  });

  revalidatePath("/");

  const dumps = await db.dumps.findMany({
    where: {
      createdById: authuser.id,
    },
  });

  // update the created by name on all dumps
  await Promise.all(
    dumps.map((dump) =>
      db.dumps.update({
        where: {
          id: dump.id,
        },
        data: {
          createdByName: name,
        },
      }),
    ),
  );

  return {
    status: 200,
    body: {
      name,
    },
  };
}

export async function createDump(dump: string, isPublic = true) {
  const auth = await getServerAuthSession();

  if (!auth) {
    return {
      status: 401,
      body: {
        error: "You must be logged in to do that.",
      },
    };
  }

  // Check length of dump
  if (dump.length > 700) {
    return {
      status: 400,
      body: {
        error: "Dump is too long.",
      },
    };
  }

  // Check if the dump is empty
  const isValidDump =
    dump
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
    return {
      status: 400,
      body: {
        error: "Dump is empty.",
      },
    };
  }

  const authuser = await db.user.findUnique({
    where: {
      id: auth.user.id,
    },
  });

  if (!authuser) {
    return {
      status: 404,
      body: {
        error: "Auth User not found.",
      },
    };
  }



  // Check if the user has made more than 2 dumps in the last 2 minutes
  let result;
  if (ratelimit) {
    result = await ratelimit.limit(authuser.id);
    if (!result.success) {
      return {
        status: 429,
        body: {
          error: `You are doing that too much. Please wait a few minutes.`,
        },
      };
    }
  }

  if (isPublic) {
    const isOk = await moderate(dump) as string;

    console.log(isOk)

    if (isOk.includes("SPAM")) {
      return {
        status: 400,
        body: {
          error: "Your dump was not approved by automod.",
        },
      };
    }
  }

  const newDump = await db.dumps.create({
    data: {
      content: dump,
      isPrivate: !isPublic,
      createdByName: authuser.username ?? "Anonymous",
      createdBy: {
        connect: {
          id: authuser.id,
        },
      },
    },
  });

  revalidatePath(`/@${authuser.username}`);

  return {
    status: 200,
    body: {
      dump: newDump,
    },
  };
}

export const deleteDump = async (id: number) => {
  const auth = await getServerAuthSession();

  if (!auth) {
    return {
      status: 401,
      body: {
        error: "You must be logged in to do that.",
      },
    };
  }

  const authuser = await db.user.findUnique({
    where: {
      id: auth.user.id,
    },
  });

  if (!authuser) {
    return {
      status: 404,
      body: {
        error: "Auth User not found.",
      },
    };
  }

  const dump = await db.dumps.findUnique({
    where: {
      id,
    },
  });

  if (!dump) {
    return {
      status: 404,
      body: {
        error: "Dump not found.",
      },
    };
  }

  if (dump.createdById !== authuser.id) {
    if (authuser.email != env.ADMIN_EMAIL) {
      return {
        status: 403,
        body: {
          error: "You do not have permission to do that.",
        },
      };
    }
  }

  await db.dumps.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/@${authuser.username}`);
  revalidatePath("/admin");

  return {
    status: 200,
    body: {
      dump,
    },
  };
};

export const changeAbout = async (about: string) => {
  const auth = await getServerAuthSession();

  if (!auth) {
    return {
      status: 401,
      body: {
        error: "You must be logged in to do that.",
      },
    };
  }

  const authuser = await db.user.findUnique({
    where: {
      id: auth.user.id,
    },
  });

  if (!authuser) {
    return {
      status: 404,
      body: {
        error: "Auth User not found.",
      },
    };
  }

  await db.user.update({
    where: {
      id: authuser.id,
    },
    data: {
      about,
    },
  });

  revalidatePath(`/@${authuser.username}`);

  return {
    status: 200,
    body: {
      about,
    },
  };
};

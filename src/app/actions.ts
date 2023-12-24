"use server";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { revalidatePath } from "next/cache";

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
      username : name.toLowerCase().replace(/ /g, "-"),
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


  // TODO: MOVE THIS TO REDIS OR OTHER BETTER SOLUTION
  // Check if the user has made more than 2 dumps in the last 2 minutes
  const dumps = await db.dumps.findMany({
    where: {
      createdById: authuser.id,
      createdAt: {
        gt: new Date(Date.now() - 120000),
      },
    },
  });

  if (dumps.length >=  2) {
    return {
      status: 429,
      body: {
        error: "You are doing that too much. Please wait a few minutes.",
      },
    };
  }

  // if any of the dumps content is the same, return an error
  const sameDump = dumps.find((d) => d.content === dump);

  if (sameDump) {
    return {
      status: 400,
      body: {
        error: "You have already posted that.",
      },
    };
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
    if (authuser.email != 'dhravyashah@gmail.com'){
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

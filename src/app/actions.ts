"use server";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { revalidatePath } from "next/cache";

export async function handleNameSubmit(name: string, about: string, password: string) {
  const auth = await getServerAuthSession();

  if (!auth) {
    return {
      status: 401,
      body: {
        error: "You must be logged in to do that.",
      },
    };
  }

  const checkAvailability = await db.user.findUnique({
    where: {
      name,
    },
  });

  if (checkAvailability?.name !== auth.user.name) {
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

  const newDump = await db.dumps.create({
    data: {
      content: dump,
      isPrivate: !isPublic,
      createdByName: authuser.name ?? "Anonymous",
      createdBy: {
        connect: {
          id: authuser.id,
        },
      },
    },
  });

  revalidatePath(`/@${authuser.name}`);

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
    return {
      status: 403,
      body: {
        error: "You do not have permission to do that.",
      },
    };
  }

  await db.dumps.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/@${authuser.name}`);

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

  revalidatePath(`/@${authuser.name}`);

  return {
    status: 200,
    body: {
      about,
    },
  };
};

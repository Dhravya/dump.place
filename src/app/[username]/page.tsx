import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DumpForm from "../dumpform";
import UserDump from "./userdump";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username.slice(3);

  // Get user from database
  const user = await db.user.findFirst({
    where: {
      username,
    },
  });

  // If user not found, return 404
  if (!user) {
    return notFound();
  }

  const auth = await getServerAuthSession();

  const dumps = await db.dumps.findMany({
    where: {
      createdById: user.id,
      AND: {
        OR: [
          {
            isPrivate: false,
          },
          {
            createdById: auth?.user?.id,
          },
        ],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="item-center flex justify-center">
      <div className="w-96 max-w-2xl">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={`https://unavatar.io/${user.email}`} />
            <AvatarFallback>{user.username!.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <h1 className="mt-2 text-5xl">{user.username}</h1>
          <p className="text-md mt-4 text-slate-400 dark:text-slate-500">
            {user.about}
          </p>
        </div>

        {/* if there's no dumps, show an empty state */}
        <div className="mt-8 text-2xl">
          {dumps.length === 0 && auth?.user.id === user.id ? (
            <div>
              <p>You don't have any dumps yet.</p>
            </div>
          ) : dumps.length === 0 && auth?.user.id !== user.id ? (
            <p>{user.username} doesn't have any public dumps yet.</p>
          ) : null}
        </div>

        {auth?.user.id === user.id && <DumpForm />}

        <ul className="gap-4">
          {dumps.map((dump) => (
            <li className="w-full" key={dump.id}>
              <UserDump {...{ dump, auth, user }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
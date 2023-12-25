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
        <div className="mt-8">
          {dumps.length === 0 && auth?.user.id === user.id ? (
            <Info text="You don't have any dumps yet." />
          ) : dumps.length === 0 && auth?.user.id !== user.id ? (
            <Info text={`${user.username} doesn't have any public dumps yet.`} />
          ) : null}
        </div>

        {auth?.user.id === user.id && <DumpForm />}



        <ul className="gap-4">
          {dumps.map((dump) => (
            <li ref={parent} className="w-full" key={dump.id}>
              <UserDump key={dump.id} {...{ dump, auth, user }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Info({ text }: { text: string }) {
  return (
    <>
      <div className="bg-border rounded-md flex items-center px-3 py-2 gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>

        <p className="text-sm">{text}</p>

      </div>
    </>
  )
}
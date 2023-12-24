import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DumpForm from "../dumpform";
import DeleteButton from "./DeleteButton";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
              <div className="mt-8 rounded-xl border p-4 dark:border-gray-500">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex text-sm text-gray-500 dark:text-gray-400">
                      {new Date(dump.createdAt).toLocaleString("en-US", {
                        day: "numeric",
                        month: "long",
                      })}
                      {"  "}
                      {new Date(dump.createdAt).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}

                      {dump.isPrivate && auth?.user.id === user.id ? (
                        <>
                          <span className="mx-2">•</span>
                          <span className="inline-flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {auth?.user.id === user.id && (
                    <DeleteButton id={dump.id} />
                  )}
                </div>
                <div className="prose-slate text-md prose-h1:text-xl prose-h2:text-lg mt-4">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {dump.content}
                  </Markdown>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import DeleteButton from "../[username]/DeleteButton";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Page() {

  const auth = await getServerAuthSession();

  if (auth?.user.email !== "dhravyashah@gmail.com") {
    notFound()
  }
  const dumps = await db.dumps.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="item-center flex justify-center">
      <div className="w-96 max-w-2xl">

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
                    </div>
                  </div>

                  {auth?.user.email === "dhravyashah@gmail.com" && (
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

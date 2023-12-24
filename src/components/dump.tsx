"use client";

import { type Dumps } from "@prisma/client";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export function Dump({ dump }: { dump: Dumps }) {
  return (
    <div className="rounded-xl border p-4 dark:border-gray-500">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <Link href={`/@${dump.createdByName}`} className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`/@${dump.createdByName}/pfp`} />
              <AvatarFallback>{dump.createdByName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <span>{dump.createdByName}</span>
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
          </Link>
        </div>
      </div>
      <div className="mt-4 prose-slate text-md prose-h1:text-xl prose-h2:text-lg ">
        <Markdown remarkPlugins={[remarkGfm]}>{dump.content}</Markdown>
      </div>
    </div>
  );
}

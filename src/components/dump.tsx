import { type Dumps } from "@prisma/client";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export function Dump({ dump }: { dump: Dumps }) {
  return (
    <div className="rounded-2xl border p-4 dark:border-white/20 transition-[border-color] dark:hover:border-white/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <Link href={`/@${dump.createdByName}`} className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage loading="lazy" src={`/@${dump.createdByName}/pfp`} />
              <AvatarFallback>{dump.createdByName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm">{dump.createdByName}</span>
              <div className="flex text-xs text-gray-500 dark:text-gray-400">
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

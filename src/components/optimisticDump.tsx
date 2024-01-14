"use client";
import useDumpStore from "@/lib/store";
import type { Session } from "next-auth";
import UserDump from "@/app/[username]/userdump";
import type { User } from "@prisma/client";

export function OptimisticDump({
  auth,
  user,
}: {
  auth: Session | null;
  user: User;
}) {
  const id = 1111;

  const dumpStore = useDumpStore();
  if (
    !dumpStore.dumpData ||
    dumpStore.dumpStatus === "failed" ||
    dumpStore.dumpStatus === "notStarted" ||
    dumpStore.dumpStatus === "completed"
  )
    return null;
  return (
    <li className="w-full opacity-25">
      <UserDump
        auth={auth}
        user={user}
        dump={{
          id: id,
          content: dumpStore.dumpData.content,
          isPrivate: dumpStore.dumpData.isPrivate,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdById: user.id,
          createdByName: user.username!,
        }}
      />
    </li>
  );
}

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { notFound } from "next/navigation";
import React from "react";
import { SettingsForm } from "./SettingsForm";

export default async function Settings({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username.slice(3);

  // Get user from database
  const user = await db.user.findFirst({
    where: {
      name: username,
    },
  });

  // If user not found, return 404
  if (!user) {
    return notFound();
  }

  const auth = await getServerAuthSession();

  if (auth?.user.id !== user.id) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-8 text-5xl">Settings</h1>{" "}
      <SettingsForm
        defaultName={user.name ?? ""}
        defaultAbout={user.about ?? ""}
      />
    </div>
  );
}

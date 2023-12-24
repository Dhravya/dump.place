"use client";

import React, { useState } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { changeAbout, handleNameSubmit } from "@/app/actions";
import { type FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SettingsForm({
  defaultName,
  defaultAbout,
}: {
  defaultName: string;
  defaultAbout: string;
}) {
  const [error, setError] = useState<string>("");

  // TODO: Add real-time check for username availability
  return (
    <>
      <form
        onSubmit={async (e: FormEvent) => {
          e.preventDefault();
          const name = (document.getElementById("name") as HTMLInputElement)
            .value;
          const about = (document.getElementById("about") as HTMLInputElement)
            .value;

          const password = (
            document.getElementById("password") as HTMLInputElement
          ).value;

          let response;
          if (name == defaultName) {
            response = await changeAbout(about);
          } else {
            response = await handleNameSubmit(name, about, password);
          }

          if (response.status == 400) {
            setError("Username already taken");
          } else if (response.status == 200) {
            setError("");
            window.location.href = `/me`;
          }
        }}
      >
        <div>
          <span className="text-2xl">Change your name</span>
          <div className="mt-2 max-w-96 text-sm text-slate-400 dark:text-slate-500">
            This is your little place on the internet. Both public and private
            will be visible here, but only you will see the private ones.
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xl text-slate-400">dump.place/@</span>{" "}
            <Input
              type="text"
              id="name"
              className="w-48"
              placeholder="dhravya"
              defaultValue={defaultName}
              required
            />
          </div>
          <div className="mt-2 text-red-500">{error}</div>
        </div>

        <div className="mt-8">
          <span className="text-2xl">About</span>
          <div className="mt-2 max-w-96 text-sm text-slate-400 dark:text-slate-500">
            What will you write about? Poems? Stories? Your life? Your thoughts?
            Learnings?{" "}
            <span className="font-bold">
              This shows up on your public profile.
            </span>
          </div>
          <Textarea
            id="about"
            className="mt-4"
            defaultValue={defaultAbout}
            placeholder="I write about my dreams and progress on my programming journey."
          />
        </div>

        <div className="mt-8">
          <span className="text-2xl">Set a password</span>
          <div className="mt-2 max-w-96 text-sm text-slate-400 dark:text-slate-500">
            You need to reset a password to make any changes to your profile.
            Passwords allow you to dump from anywhere. This is required for the{" "}
            <Link className="text-sky-500" href="/ios">
              ios shortcut.
            </Link>
          </div>
          <Input
            type="password"
            id="password"
            placeholder="mystrongpassword"
            className="mt-4"
            required
          />
          <div className="mt-2 text-red-500">{error}</div>
        </div>

        <Button type="submit" className="group mt-8 flex w-full gap-2">
          Save
          <ArrowRightIcon className="duration-150 ease-in-out group-hover:translate-x-2" />
        </Button>
      </form>
    </>
  );
}

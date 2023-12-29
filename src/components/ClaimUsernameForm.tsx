"use client";

import { Input } from "./ui/input";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { createDump, handleNameSubmit } from "@/app/actions";
import { type FormEvent } from "react";
import { Textarea } from "./ui/textarea";
import Link from "next/link";

function ClaimUsernameForm() {
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
          const dump = (document.getElementById("dump") as HTMLInputElement)
            .value;
          const password = (
            document.getElementById("password-1") as HTMLInputElement
          ).value;

          console.log(name, about, dump)

          const response = await handleNameSubmit(name, about, password);

          console.log(response)

          if (response.status == 400) {
            setError(response.body.error ?? "Something went wrong.");
          } else if (response.status == 200) {
            setError("");
            await createDump(dump, true);
          }
        }}
      >
        <div>
          <span className="text-2xl">Claim your name</span>
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
              pattern="^[a-z0-9_]{3,20}$"
              required
            />
          </div>
          <div className="mt-2 text-red-500 max-w-96">{error}</div>
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
            placeholder="I write about my dreams and progress on my programming journey."
          />
        </div>

        <div className="mt-8">
          <span className="text-2xl">Set a password</span>
          <div className="mt-2 max-w-96 text-sm text-slate-400 dark:text-slate-500">
            Passwords allow you to dump from anywhere. This is required for the{" "}
            <Link className="text-sky-500" href="/ios">
              ios shortcut.
            </Link>
          </div>
          <Input
            type="password"
            id="password-1"
            placeholder="mystrongpassword"
            className="mt-4"
            required
          />
          <div className="mt-2 text-red-500">{error}</div>
        </div>

        <div className="mt-8">
          <span className="text-2xl">First dump</span>
          <div className="mt-2 max-w-96 text-sm text-slate-400 dark:text-slate-500">
            Write your first public dump. You can always delete it later.{" "}
          </div>
          <Textarea
            id="dump"
            className="mt-4"
            placeholder="Hi! I'm so excited to be here."
            required
          />
        </div>

        <Button type="submit" className="group mt-8 flex w-full gap-2">
          Start DUMPing
          <ArrowRightIcon className="duration-150 ease-in-out group-hover:translate-x-2" />
        </Button>
      </form>
    </>
  );
}

export default ClaimUsernameForm;

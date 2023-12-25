"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, type FormEvent } from "react";
import { createDump } from "./actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function DumpForm({ className }: { className?: string }) {

  const [isDumping, setIsDumping] = useState(false);

  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();

        setIsDumping(true);
        document.querySelector(".loader")!.classList.add("loading");

        const dump = (
          document.getElementById("dumpcontent") as HTMLInputElement
        ).value;

        const isPublic =
          (
            document.getElementById("isPrivate") as HTMLInputElement
          ).getAttribute("data-state") == "checked";

        await createDump(dump, isPublic);

        // Clear input
        (document.getElementById("dumpcontent") as HTMLInputElement).value = "";

        setIsDumping(false);
        document.querySelector(".loader")!.classList.add("complete");
        document.querySelector(".loader")!.classList.remove("loading");
        
        setTimeout(() => {
          document.querySelector(".loader")!.classList.remove("complete");
        }, 1000);
      }}
      className={`mt-4 w-full ${className}`}
    >
      <Textarea required id="dumpcontent" placeholder="What's on your mind?" disabled={isDumping} />
      <div className="mt-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Switch defaultChecked={true} id="isPrivate" disabled={isDumping} />
          <Label htmlFor="isPrivate">Public</Label>
        </div>
        <Button type="submit" disabled={isDumping}>Dump</Button>
      </div>
    </form>
  );
}

export default DumpForm;

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type FormEvent } from "react";
import { createDump } from "./actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function DumpForm({ className }: { className?: string }) {
  return (
    <form
      onSubmit={async (e: FormEvent) => {
        e.preventDefault();

        const dump = (
          document.getElementById("dumpcontent") as HTMLInputElement
        ).value;

        const isPublic =
          (
            document.getElementById("isPrivate") as HTMLInputElement
          ).getAttribute("data-state") == "checked";

        await createDump(dump, isPublic);
      }}
      className={`mt-4 w-full ${className}`}
    >
      <Textarea required id="dumpcontent" placeholder="What's on your mind?" />
      <div className="mt-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Switch defaultChecked={true} id="isPrivate" />
          <Label htmlFor="isPrivate">Public</Label>
        </div>
        <Button type="submit">Dump</Button>
      </div>
    </form>
  );
}

export default DumpForm;

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type FormEvent, useEffect, useRef } from "react";
import { createDump } from "./actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import useDumpStore from "@/lib/store";

function DumpForm({ className }: { className?: string }) {
  const dumpStore = useDumpStore();
  const isFormDisabled = dumpStore.dumpStatus === "inProgress";
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submitDump = async (e: FormEvent) => {
    e.preventDefault();

    document.querySelector(".loader")!.classList.add("loading");

    const dump = (document.getElementById("dumpcontent") as HTMLInputElement)
      .value;

    const isPublic =
      (document.getElementById("isPrivate") as HTMLInputElement).getAttribute(
        "data-state",
      ) == "checked";

    const isValidDump =
      dump
        .replaceAll(" ", "")
        .replaceAll(/\n/g, "")
        .replaceAll(/\t/g, "")
        .replaceAll("*", "")
        .replaceAll("`", "")
        .replaceAll("#", "")
        .replaceAll("[", "")
        .replaceAll("]", "")
        .trim().length > 0;
    if (!isValidDump) {
      toast.error("Dump is empty");
      dumpStore.removeDump();

      document.querySelector(".loader")!.classList.add("complete");
      document.querySelector(".loader")!.classList.remove("loading");
      return;
    }
    dumpStore.updateDump({
      content: dump,
      isPrivate: !isPublic,
    });

    const response = await createDump(dump, isPublic);

    if (response.body.error) {
      dumpStore.removeDump();
      toast.error(response.body.error);
    }

    dumpStore.completeDump();

    // Clear input
    (document.getElementById("dumpcontent") as HTMLInputElement).value = "";

    document.querySelector(".loader")!.classList.add("complete");
    document.querySelector(".loader")!.classList.remove("loading");

    setTimeout(() => {
      document.querySelector(".loader")!.classList.remove("complete");
    }, 1000);
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (/[a-zA-Z]/.test(e.key) && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        inputRef.current!.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <form
      onSubmit={submitDump}
      className={`mt-4 w-full ${className}`}
      onKeyDown={(e) => {
        if (e.key == "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          void submitDump(e);
        }
      }}
    >
      <Textarea
        ref={inputRef}
        required
        id="dumpcontent"
        placeholder="What's on your mind?"
        disabled={isFormDisabled}
      />
      <div className="mt-4 flex flex-row-reverse justify-between">
        <Button type="submit" disabled={isFormDisabled}>
          Dump
        </Button>
        <div className="flex items-center gap-2">
          <Switch
            defaultChecked={true}
            id="isPrivate"
            disabled={isFormDisabled}
          />
          <Label htmlFor="isPrivate">Public</Label>
        </div>
      </div>
    </form>
  );
}

export default DumpForm;

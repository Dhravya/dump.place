"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { createDump } from "./actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import useDumpStore from "@/lib/store";

function DumpForm({ className }: { className?: string }) {
  const dumpStore = useDumpStore();
  const isFormDisabled = dumpStore.dumpStatus === "inProgress";

  const [dumpContent, setDumpContent] = useState("");
  const [isOutline, setIsOutline] = useState(false);
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
    setDumpContent("");
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
      {!isOutline ? (
        <Textarea
          ref={inputRef}
          required
          id="dumpcontent"
          placeholder="What's on your mind?"
          disabled={isFormDisabled}
          value={dumpContent}
          onChange={(e) => {
            setDumpContent(e.target.value);
          }}
        />
      ) : (
        <Markdown
          className="text-md prose prose-slate mt-4 text-white prose-h1:text-xl prose-h2:text-lg prose-img:rounded-md"
          remarkPlugins={[remarkGfm]}
        >
          {dumpContent}
        </Markdown>
      )}
      <div className="mt-4 flex  justify-between">
        <div className="flex items-center gap-2">
          <Switch
            defaultChecked={true}
            id="isPrivate"
            disabled={isFormDisabled}
          />

          <Label htmlFor="isPrivate">Public</Label>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={isOutline ? "secondary" : "ghost"}
            onClick={() => setIsOutline((prev) => !prev)}
          >
            Preview
          </Button>

          <Button type="submit" disabled={isFormDisabled || isOutline}>
            Dump
          </Button>
        </div>
      </div>
    </form>
  );
}

export default DumpForm;

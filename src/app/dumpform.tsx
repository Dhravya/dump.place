"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, type FormEvent, useEffect, useRef } from "react";
import { createDump } from "./actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

function DumpForm({ className }: { className?: string }) {
  const [isDumping, setIsDumping] = useState(false);
  const [dumpContent, setDumpContent] = useState("");
  const [isOutline, setIsOutline] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submitDump = async (e: FormEvent) => {
    e.preventDefault();

    setIsDumping(true);
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
      setIsDumping(false);
      document.querySelector(".loader")!.classList.add("complete");
      document.querySelector(".loader")!.classList.remove("loading");
      return;
    }
    const response = await createDump(dump, isPublic);

    if (response.body.error) {
      toast.error(response.body.error);
    }

    // Clear input
    setDumpContent("");
    setIsDumping(false);
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
          disabled={isDumping}
          value={dumpContent}
          onChange={(e) => {
            setDumpContent(e.target.value);
          }}
        />
      ) : (
        <Markdown
          className="text-md prose prose-slate mt-4 text-white prose-h1:text-xl prose-h2:text-lg"
          remarkPlugins={[remarkGfm]}
        >
          {dumpContent}
        </Markdown>
      )}
      <div className="mt-4 flex  justify-between">
        <div className="flex items-center gap-2">
          <Switch defaultChecked={true} id="isPrivate" disabled={isDumping} />

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

          <Button type="submit" disabled={isDumping || isOutline}>
            Dump
          </Button>
        </div>
      </div>
    </form>
  );
}

export default DumpForm;

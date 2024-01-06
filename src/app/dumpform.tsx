'use client';

import { Button } from '@/components/ui/button';
import { useState, type FormEvent, useEffect, useRef } from 'react';
import { createDump } from './actions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import { Editor } from 'novel';
import { type MDXEditorMethods } from '@mdxeditor/editor';

function DumpForm({ className }: { className?: string }) {
  const [isDumping, setIsDumping] = useState(false);
  const [dumpContent, setDumpContent] = useState(
    "What's on your mind? (Markdown is supported!)",
  );
  const [isOutline, setIsOutline] = useState(false);
  const inputRef = useRef<MDXEditorMethods>(null);

  const submitDump = async (e: FormEvent) => {
    e.preventDefault();

    setIsDumping(true);
    document.querySelector('.loader')!.classList.add('loading');

    const dump = inputRef.current?.getMarkdown() ?? dumpContent;

    const isPublic =
      (document.getElementById('isPrivate') as HTMLInputElement).getAttribute(
        'data-state',
      ) == 'checked';

    const isValidDump =
      dump
        .replaceAll(' ', '')
        .replaceAll(/\n/g, '')
        .replaceAll(/\t/g, '')
        .replaceAll('*', '')
        .replaceAll('`', '')
        .replaceAll('#', '')
        .replaceAll('[', '')
        .replaceAll(']', '')
        .trim().length > 0;
    if (!isValidDump) {
      toast.error('Dump is empty');
      setIsDumping(false);
      document.querySelector('.loader')!.classList.add('complete');
      document.querySelector('.loader')!.classList.remove('loading');
      return;
    }
    const response = await createDump(dump, isPublic);

    if (response.body.error) {
      toast.error(response.body.error);
    }

    // Clear input
    setDumpContent('');
    setIsDumping(false);
    document.querySelector('.loader')!.classList.add('complete');
    document.querySelector('.loader')!.classList.remove('loading');

    setTimeout(() => {
      document.querySelector('.loader')!.classList.remove('complete');
    }, 1000);
  };

  // only allow the first element with _contentEditable_11eqz_352 to be visible
  useEffect(() => {
    const elements = document.querySelectorAll('[data-contenteditable]');
    for (let i = 0; i < elements.length; i++) {
      if (i == 0) {
        elements[i]?.classList.remove('hidden');
      } else {
        elements[i]?.classList.add('hidden');
      }
    }
  }, []);

  return (
    <form
      onSubmit={submitDump}
      className={`mt-4 w-full ${className}`}
      onKeyDown={(e) => {
        if (e.key == 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          void submitDump(e);
        }
      }}
    >
      {!isOutline ? (
        // <Textarea
        //   ref={inputRef}
        //   required
        //   id="dumpcontent"
        //   placeholder="What's on your mind?"
        //   disabled={isDumping}
        //   value={dumpContent}
        //   onChange={(e) => {
        //     setDumpContent(e.target.value);
        //   }}
        // />
        <Editor
          onDebouncedUpdate={(value) => {
            setDumpContent(value?.getText() ?? '');
            console.log(dumpContent);
          }}
          disableLocalStorage
          className="w-full rounded-2xl border-[0.1px] border-black/50  bg-gradient-to-tr from-purple-400/10 via-gray-500/5 to-transparent shadow-zinc-500 transition-[border-color] dark:border-white/20 dark:shadow-purple-400 dark:hover:border-white/50"
        />
      ) : (
        <Markdown className="dumpMarkdown" remarkPlugins={[remarkGfm]}>
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
            variant={isOutline ? 'secondary' : 'ghost'}
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

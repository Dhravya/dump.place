'use client';

import { Button } from '@/components/ui/button';
import { useState, type FormEvent, useEffect, useRef } from 'react';
import { createDump } from './actions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Editor } from 'novel';
import { Markdown } from 'tiptap-markdown';

function DumpForm({ className }: { className?: string }) {
  const [isDumping, setIsDumping] = useState(false);
  const [dumpContent, setDumpContent] = useState(
    "What's on your mind? (Markdown is supported!)",
  );
  const dumpRef = useRef<HTMLDivElement>(null);

  const submitDump = async (e: FormEvent) => {
    e.preventDefault();
    setDumpContent('');

    setIsDumping(true);
    document.querySelector('.loader')!.classList.add('loading');

    const isPublic =
      (document.getElementById('isPrivate') as HTMLInputElement).getAttribute(
        'data-state',
      ) == 'checked';

    const isValidDump =
      dumpContent
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
    const response = await createDump(dumpContent, isPublic);

    if (response.body.error) {
      toast.error(response.body.error);
    }

    // TODO: DELETE THE ORIGINAL MESSAGE

    toast.success('Dumped!');
    setIsDumping(false);
    document.querySelector('.loader')!.classList.add('complete');
    document.querySelector('.loader')!.classList.remove('loading');

    setTimeout(() => {
      document.querySelector('.loader')!.classList.remove('complete');
    }, 500);
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
      <Editor
        onUpdate={(value) => {
          if (!value) return;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          setDumpContent(value.storage.markdown.getMarkdown() as string);
        }}
        className="w-full rounded-2xl border-[0.1px] border-black/50  bg-gradient-to-tr from-purple-400/10 via-gray-500/5 to-transparent shadow-zinc-500 transition-[border-color] dark:border-white/20 dark:shadow-purple-400 dark:hover:border-white/50"
        defaultValue={''}
        disableLocalStorage
        extensions={[Markdown]}
      />
      <div className="mt-4 flex  justify-between">
        <div className="flex items-center gap-2">
          <Switch defaultChecked={true} id="isPrivate" disabled={isDumping} />

          <Label htmlFor="isPrivate">Public</Label>
        </div>

        <div className="flex gap-2">
          <Button variant={'secondary'} type="submit" disabled={isDumping}>
            Dump
          </Button>
        </div>
      </div>
    </form>
  );
}

export default DumpForm;

import { tryCatch } from '@/lib/utils';
import { db } from '@/server/db';
import React from 'react';
import Gallery from './gallery';

async function DumpGallery() {
    // Get all public dumps from authorized users
    const top50PublicDumps = await tryCatch(async () =>
    await db.dumps.findMany({
      where: {
        isPrivate: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 25,
    }), []
    );
  return (
    <>
    <Gallery topDumps={top50PublicDumps} />
    </>
  );
}

export default DumpGallery;
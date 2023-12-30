'use client';

import { Dump } from '@/components/dump';
import { type Dumps } from '@prisma/client';
import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

function Gallery({ topDumps }: { topDumps: Dumps[] }) {
  return (
    <>
      <h2 className="text-center font-heading text-4xl font-bold  md:text-5xl mb-8">
        Public{' '}
        <span className="bg-gradient-to-tr from-purple-400/80 via-white to-white/90 bg-clip-text text-transparent">
          Dumps
        </span>
      </h2>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
        <Masonry gutter="16px">
          {topDumps.map((dump) => (
            <Dump key={dump.id} dump={dump} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}

export default Gallery;

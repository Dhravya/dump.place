'use client';

import { Dump } from '@/components/dump';
import { type Dumps } from '@prisma/client';
import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

function Gallery({ topDumps }: { topDumps: Dumps[] }) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
      <Masonry gutter="16px">
        {topDumps.map((dump) => (
          <Dump key={dump.id} dump={dump} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}

export default Gallery;

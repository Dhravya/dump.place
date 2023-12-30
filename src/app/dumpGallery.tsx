'use client'

import { Dump } from "@/components/dump";
import { type Dumps } from "@prisma/client";
import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

function DumpGallery({ top100PublicDumps }: { top100PublicDumps: Dumps[] }) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2}}>
    
      <Masonry gutter="16px">
        {top100PublicDumps.map((dump) => (
          <Dump key={dump.id} dump={dump} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}

export default DumpGallery;

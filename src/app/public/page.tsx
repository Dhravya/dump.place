import { db } from "@/server/db";
import DumpGallery from "../dumpGallery";
import Link from "next/link";

async function Page() {
  const top100PublicDumps = await db.dumps.findMany({
    where: {
      isPrivate: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return (
    <main className="flex w-full items-center justify-center p-4 md:p-8">
      <div className="flex max-w-2xl items-center justify-center ">
        <div className="flex h-full flex-col items-center border border-red-500 w-full">
          <h1 className="w-full text-center text-5xl font-bold">
            public <span className="italic">DUMPS</span>
          </h1>
          <h2 className="mt-4">
            All dumps are visible here. spam is automoderated and deleted, so don't even try
            Just <span className="font-bold italic">DUMP.</span> Get{" "}
            <Link className="text-sky-500" href="https://dump.place/ios">
              the IOS shortcut and add it to the homescreen for even faster
              DUMPing
            </Link>
          </h2>

          {/* Show top 100 public dumps in masonry layout */}
          <div className="mt-8 w-full">
            <DumpGallery top100PublicDumps={top100PublicDumps} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;

import { getServerAuthSession } from "@/server/auth";
import ClaimUsernameForm from "@/components/ClaimUsernameForm";
import { db } from "@/server/db";
import DumpGallery from "./dumpGallery";
import DumpForm from "./dumpform";
import Link from "next/link";

export default async function HomePage() {
  const auth = await getServerAuthSession();

  const authorized_users = ["dhravya", "Luke", "ankur", "yxsh", "kakashifr"];

  // Get all public dumps from authorized users
  const top100PublicDumps = await db.dumps.findMany({
    where: {
      isPrivate: false,
      createdByName: {
        in: authorized_users,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return (
    <main className="flex w-full items-center justify-center p-4 md:p-8">
      <div className="flex max-w-2xl items-center justify-center ">
        <div className="flex h-full flex-col items-center">
          <h1 className="text-center text-5xl font-bold">
            <span className="italic">DUMP</span> your thoughts.
          </h1>
          <h2 className="mt-4">
            dump.place is a minimal place to dump your thoughts. It's like
            Twitter, but without all the noise. Dumps can be private or public.
            Public dumps are visible to everyone, while private dumps are only
            yours. No followers, no likes, no comments, no ads, no tracking.
            Just <span className="font-bold italic">DUMP.</span> Get{" "}
            <Link className="text-sky-500" href="https://dump.place/ios">
              the IOS shortcut and add it to the homescreen for even faster
              DUMPing
            </Link>
          </h2>

          {auth && !auth.user.username && (
            <div className="mt-16">
              <ClaimUsernameForm />
            </div>
          )}

          {auth?.user.username && <DumpForm className="mt-8" />}
          {/* Show top 100 public dumps in masonry layout */}
          <div className="mt-8 w-full flex flex-col gap-8">
            <h2 className="text-center text-2xl font-bold">
              Featured Dumps
            </h2>
            <DumpGallery top100PublicDumps={top100PublicDumps} />
          </div>
        </div>
      </div>
    </main>
  );
}

import { getServerAuthSession } from "@/server/auth";
import ClaimUsernameForm from "@/components/ClaimUsernameForm";
import { db } from "@/server/db";
import DumpGallery from "./dumpGallery";
import DumpForm from "./dumpform";
import { tryCatch } from "@/lib/utils";
import HeroSection from "@/components/landing-components/hero-section";

export default async function HomePage() {
  const auth = await getServerAuthSession();

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
    <main className="flex  h-full w-screen flex-col items-center justify-center  overflow-x-hidden bg-gradient-to-tl from-transparent via-purple-500/5 to-black p-4 md:p-8 ">
      <HeroSection />
      <div className="flex h-full max-w-2xl items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          {auth && !auth.user.username && (
            <div className="mt-16">
              <ClaimUsernameForm />
            </div>
          )}
          {auth?.user.username && <DumpForm className="mt-8" />}
          {/* Show top 100 public dumps in masonry layout */}
          <div className="mt-8 flex w-full flex-col gap-8">
            <h2 className="text-center text-2xl font-bold">
              public <span className="italic">DUMPS</span>
            </h2>
            <DumpGallery top100PublicDumps={top50PublicDumps} />
          </div>
        </div>
      </div>
    </main>
  );
}

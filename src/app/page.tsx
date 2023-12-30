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
  const top50PublicDumps = await tryCatch(
    async () =>
      await db.dumps.findMany({
        where: {
          isPrivate: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 25,
      }),
    [],
  );

  return (
    <main className="flex h-full w-screen flex-col items-center justify-center  overflow-x-hidden bg-gradient-to-tl from-transparent via-purple-500/5 to-black p-4 md:p-8 ">
      <HeroSection signedIn={auth?.user.name ? true : false} />
      <div className="flex h-full w-full items-center justify-center md:w-[60%]">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          {auth && !auth.user.username && (
            <div className="mt-16">
              <ClaimUsernameForm />
            </div>
          )}
          {auth?.user.username && <DumpForm />}
        </div>
      </div>
      <div className="mt-8 flex w-full flex-col gap-8 md:w-[60%]">
        <h2 className="text-center font-heading text-4xl font-bold  md:text-5xl">
          Public{" "}
          <span className="bg-gradient-to-tr from-purple-400/80 via-white to-white/90 bg-clip-text text-transparent">
            Dumps
          </span>
        </h2>
        <div className="mt-2">
          <DumpGallery top100PublicDumps={top50PublicDumps} />
        </div>
      </div>
    </main>
  );
}

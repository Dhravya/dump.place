import { getServerAuthSession } from "@/server/auth";
import ClaimUsernameForm from "@/components/ClaimUsernameForm";
import DumpGallery from "./dumpGallery/galleryFetch";
import DumpForm from "./dumpform";
import HeroSection from "@/components/landing-components/hero-section";
import { Suspense } from "react";
import { DumpSkeletonWrapper } from "@/components/skeletons/dumpskeleton";

export default async function HomePage() {
  const auth = await getServerAuthSession();


  return (
    <main className="flex  h-full w-screen flex-col items-center justify-center  overflow-x-hidden bg-gradient-to-tl from-transparent via-purple-500/5 to-black p-4 md:p-8 ">
      <HeroSection signedIn={auth?.user.name ? true : false} />
      <div className="flex h-full md:w-[60%] w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          {auth && !auth.user.username && (
            <div className="mt-16">
              <ClaimUsernameForm />
            </div>
          )}
          {auth?.user.username && <DumpForm />}
        </div>
      </div>
      {/* <div className="mt-8 flex md:w-[60%] w-full flex-col gap-8">
        <div className="mt-2">
          <Suspense fallback={<DumpSkeletonWrapper />}>
            <DumpGallery/>
          </Suspense>
        </div>
      </div> */}
    </main>
  );
}

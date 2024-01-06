import { getServerAuthSession } from "@/server/auth";
import ClaimUsernameForm from "@/components/ClaimUsernameForm";
import HeroSection from "@/components/landing-components/hero-section";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const auth = await getServerAuthSession();

  if (auth?.user.username) {
    redirect(`/me`);
  }

  return (
    <main className="flex  h-full w-screen flex-col items-center justify-center  overflow-x-hidden bg-gradient-to-tl from-transparent via-purple-500/5 to-black p-4 md:p-8 min-h-screen ">
      <HeroSection signedIn={auth?.user.name ? true : false} />
      <div className="flex h-full md:w-[60%] w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          {auth && !auth.user.username && (
            <div className="mt-16">
              <ClaimUsernameForm />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

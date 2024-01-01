function DumpSkeleton({ user }: { user?: boolean }) {
  return (
    <div className="w-full flex-col items-start justify-start gap-2 rounded-2xl border-[0.1px] border-black/50 bg-gradient-to-tr from-purple-400/10 via-gray-500/5 to-transparent p-4 px-7 py-5 shadow-zinc-500 transition-[border-color] dark:border-white/20 dark:shadow-purple-400">
      <div className="flex items-center justify-between gap-2">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center gap-2">
            {/* avatar skeleton */}
            {!user && (
              <div className="h-7 w-7 animate-pulse rounded-full bg-white/15"></div>
            )}
            <div className="flex w-full flex-col gap-2">
              {/* author skeleton */}
              {!user && (
                <div className="h-4 w-2/5 animate-pulse rounded-sm bg-white/15 md:w-3/5 xl:w-2/5"></div>
              )}
              {/* date skeleton */}
              {user ? (
                <div className="h-4 w-40 animate-pulse rounded-sm bg-white/15"></div>
              ) : (
                <div className="h-3 w-1/5 animate-pulse rounded-sm bg-white/15 md:w-2/5 xl:w-1/5"></div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* body skeleton */}
      <div className="mt-4 h-5 w-full animate-pulse rounded-sm bg-white/15"></div>
      {user && (
        <>
          <div className="mt-2 h-5 w-full animate-pulse rounded-sm bg-white/15"></div>
          <div className="mt-2 h-5 w-full animate-pulse rounded-sm bg-white/15"></div>
        </>
      )}
    </div>
  );
}

export function UserDumpSkeletonWrapper() {
  return (
    <div className="item-center flex justify-center">
      <div className="w-96 max-w-2xl">
        <div className="flex flex-col items-center justify-center">
          {/* avatar skeleton */}
          <div className="h-24 w-24 animate-pulse rounded-full bg-white/15"></div>
          {/* username skeleton */}
          <div className="mt-2 h-10 w-48 animate-pulse rounded-sm bg-white/15"></div>
          {/* about skeleton */}
          <div className="mt-6 h-4 w-36 animate-pulse rounded-sm bg-white/15"></div>
        </div>

        {/* user dump skeletons */}
        <ul className="mt-8 flex flex-col gap-8">
          <li className="w-full">
            <DumpSkeleton user />
          </li>
          <li className="w-full">
            <DumpSkeleton user />
          </li>
          <li className="w-full">
            <DumpSkeleton user />
          </li>
          <li className="w-full">
            <DumpSkeleton user />
          </li>
          <li className="w-full">
            <DumpSkeleton user />
          </li>
        </ul>
      </div>
    </div>
  );
}

export function DumpSkeletonWrapper() {
  return (
    <>
      <h2 className="mb-8 text-center font-heading text-4xl  font-bold md:text-5xl">
        Public{" "}
        <span className="bg-gradient-to-tr from-purple-400/80 via-white to-white/90 bg-clip-text text-transparent">
          Dumps
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DumpSkeleton />
        <DumpSkeleton />
        <DumpSkeleton />
        <DumpSkeleton />
        <DumpSkeleton />
        <DumpSkeleton />
        <DumpSkeleton />
        <DumpSkeleton />
        <DumpSkeleton />
        <DumpSkeleton />
      </div>
    </>
  );
}

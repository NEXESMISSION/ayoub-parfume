export default function StoreProductLoading() {
  return (
    <main className="min-h-[100dvh] bg-[#faf8f5] pb-12">
      <div className="h-12 animate-pulse border-b border-stone-200/80 bg-white/50" />
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div className="mb-6 h-4 w-56 animate-pulse rounded bg-stone-200/50" />
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="mx-auto aspect-square w-full max-w-md animate-pulse rounded-[1.25rem] bg-stone-200/60 lg:mx-0" />
          <div className="space-y-4">
            <div className="h-10 w-full animate-pulse rounded-lg bg-stone-200/70 sm:h-12" />
            <div className="h-12 w-40 animate-pulse rounded-lg bg-stone-200/50" />
            <div className="h-32 animate-pulse rounded-2xl bg-stone-200/40" />
            <div className="h-52 animate-pulse rounded-[1.25rem] bg-stone-200/30" />
          </div>
        </div>
      </div>
    </main>
  );
}

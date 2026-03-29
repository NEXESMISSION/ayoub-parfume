export default function StoreCategoryLoading() {
  return (
    <main className="min-h-[100dvh] bg-[#faf8f5]">
      <div className="h-12 animate-pulse border-b border-stone-200/80 bg-white/50" />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 border-b border-stone-200/60 pb-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-stone-200/70 sm:h-10 sm:w-64" />
          <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-stone-200/50" />
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="overflow-hidden rounded-2xl border border-stone-200/50 bg-white/70">
              <div className="aspect-[1/1.08] animate-pulse bg-stone-200/60" />
              <div className="space-y-2 p-3 sm:p-4">
                <div className="h-4 animate-pulse rounded bg-stone-200/60" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-stone-200/40" />
                <div className="mt-3 h-10 animate-pulse rounded-lg bg-stone-100" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

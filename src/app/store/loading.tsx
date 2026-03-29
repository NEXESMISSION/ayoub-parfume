export default function StoreLoading() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#faf8f5]">
      <div className="h-12 shrink-0 animate-pulse border-b border-stone-200/70 bg-white/60" />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
        <div className="mx-auto mb-8 h-24 w-full max-w-lg animate-pulse rounded-2xl bg-stone-200/70" />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="overflow-hidden rounded-xl border border-stone-200/60 bg-white/80 sm:rounded-2xl"
            >
              <div className="aspect-[16/10] animate-pulse bg-stone-200/60 sm:aspect-[4/3]" />
              <div className="flex h-12 gap-2 border-t border-stone-100 p-3">
                <div className="h-3 flex-1 animate-pulse rounded bg-stone-200/60" />
                <div className="size-6 shrink-0 animate-pulse rounded-full bg-stone-200/50" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default function LoadingStoreCategory() {
  return (
    <div className="py-8 sm:py-10">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3 w-12 animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-3 animate-pulse rounded bg-stone-100" />
        <div className="h-3 w-12 animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-3 animate-pulse rounded bg-stone-100" />
        <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
      </div>
      <div className="mb-8 h-40 animate-pulse rounded-3xl bg-stone-200/60 sm:mb-10 sm:h-56" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="aspect-[4/3] bg-stone-200/60" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-stone-200" />
              <div className="h-3 w-1/2 rounded bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

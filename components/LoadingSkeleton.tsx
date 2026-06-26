export function LoadingSkeleton() {
  return (
    <div className="masonry animate-pulse">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="masonry-item">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <div className="h-48 bg-zinc-100" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-20 rounded bg-zinc-100" />
              <div className="h-3 w-full rounded bg-zinc-100" />
              <div className="h-3 w-3/4 rounded bg-zinc-100" />
              <div className="flex gap-3 pt-2">
                <div className="h-8 w-8 rounded-full bg-zinc-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/2 rounded bg-zinc-100" />
                  <div className="h-3 w-2/3 rounded bg-zinc-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

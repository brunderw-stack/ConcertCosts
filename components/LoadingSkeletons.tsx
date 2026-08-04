export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-2">
        <div className="skeleton h-9 w-48" />
        <div className="skeleton h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-box border border-base-300 bg-base-100 p-4"
          >
            <div className="skeleton mb-3 h-3 w-24" />
            <div className="skeleton h-7 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body gap-4">
              <div className="skeleton h-5 w-40" />
              <div className="skeleton h-56 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConcertsLoadingSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading concerts">
      <div className="space-y-2">
        <div className="skeleton h-9 w-44" />
        <div className="skeleton h-4 w-72 max-w-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body gap-4">
              <div className="flex justify-between gap-3">
                <div className="space-y-2">
                  <div className="skeleton h-6 w-48" />
                  <div className="skeleton h-4 w-32" />
                </div>
                <div className="skeleton h-7 w-24" />
              </div>
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((__, i) => (
                  <div key={i} className="skeleton h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AddLoadingSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading form">
      <div className="space-y-2">
        <div className="skeleton h-9 w-40" />
        <div className="skeleton h-4 w-80 max-w-full" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="card border border-base-300 bg-base-100 shadow-sm"
        >
          <div className="card-body gap-5">
            <div className="skeleton h-6 w-36" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

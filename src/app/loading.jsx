export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-bg pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Skeleton */}
        <div className="mb-20 animate-pulse">
          <div className="h-8 w-48 bg-white/5 rounded-full mb-8 mx-auto"></div>
          <div className="h-16 md:h-24 w-full max-w-4xl bg-white/5 rounded-3xl mb-8 mx-auto"></div>
          <div className="h-4 w-64 bg-white/5 rounded-full mx-auto"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5 h-[450px] animate-pulse">
              <div className="aspect-video w-full bg-white/5 rounded-3xl mb-6"></div>
              <div className="h-4 w-24 bg-white/5 rounded-full mb-4"></div>
              <div className="h-8 w-full bg-white/5 rounded-xl mb-4"></div>
              <div className="h-20 w-full bg-white/5 rounded-xl mb-8"></div>
              <div className="h-12 w-full bg-white/5 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

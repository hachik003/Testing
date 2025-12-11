import Link from 'next/link';

export default function SchedulePage() {
  // Later you will replace [] with fetched data from your backend
  const events: any[] = []; 

  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-4xl px-4 md:px-8 py-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-neutral-900">
              Event Schedule
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 mt-1">
              Check upcoming club and circle events.
            </p>
          </div>

          <Link
            href="/"
            className="text-xs md:text-sm text-neutral-600 border border-neutral-300 rounded-full px-3 py-1 hover:bg-neutral-200 transition"
          >
            ← Back to Home
          </Link>
        </header>

        {/* Event List */}
        <section className="mt-6 space-y-4">

          {/* If no events */}
          {events.length === 0 && (
            <p className="text-neutral-400 text-sm">
              No events available.
            </p>
          )}

          {/* Later: map your real data */}
          {/* 
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
          */}

        </section>

      </div>
    </main>
  );
}
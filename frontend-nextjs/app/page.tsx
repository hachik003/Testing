'use client';

import { useState } from 'react';
import Link from 'next/link';

type Event = {
  id: number;
  date: string;
  month: string;
  clubName: string;
  description: string;
};

type Club = {
  id: number;
  name: string;
  category: 'All' | 'Sport' | 'Culture';
  description: string;
};

const categories = ['All', 'Sport', 'Culture'] as const;

export default function HomePage() {
  // ● Empty arrays for now (replace with API calls later)
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>('All');

  const filteredClubs =
    activeCategory === 'All'
      ? clubs
      : clubs.filter((club) => club.category === activeCategory);

  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-6xl px-4 md:px-8 py-8">
        
        {/* Top logo + app name */}
        <section className="flex flex-col items-center mt-8 mb-10">
          <div className="h-32 w-32 rounded-full bg-neutral-300 flex items-center justify-center text-sm text-neutral-600">
            App logo
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-xl font-semibold tracking-wide">App Name</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Short description of the app goes here.
            </p>
          </div>
        </section>

        {/* Calendar */}
        <section className="bg-white rounded-3xl shadow-sm px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/schedule"
              className="inline-flex px-8 py-2 bg-neutral-200 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-300 transition"
            >
            Calendar
            </Link>
          </div>

          {/* Events horizontal scroll */}
          <div className="relative mt-5">
            <div className="flex gap-4 overflow-x-auto pb-3 pr-16 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">

              {/* No data message */}
              {events.length === 0 && (
                <p className="text-neutral-400 text-sm ml-2">No events yet.</p>
              )}

              {events.map((event) => (
                <div
                  key={event.id}
                  className="min-w-[170px] bg-neutral-100 rounded-3xl shadow-sm px-3 py-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-2">
                    <div className="bg-rose-200 rounded-2xl px-3 py-2 flex flex-col items-center text-[10px] font-semibold text-neutral-700">
                      <span className="text-base leading-none">{event.date}</span>
                      <span className="mt-0.5 uppercase tracking-wide">
                        {event.month}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-neutral-800 mt-1">
                      {event.clubName}
                    </p>
                  </div>

                  <div className="mt-3 bg-white rounded-3xl shadow-inner px-3 py-3 text-[11px] text-neutral-600 relative">
                    <p className="pr-4">{event.description}</p>
                    <span className="absolute right-2 bottom-2 text-[13px]">❤️</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <button
              type="button"
              className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white shadow-md border border-neutral-200"
            >
              <span className="text-2xl leading-none">➜</span>
            </button>
          </div>
        </section>

        {/* Club categories */}
        <section className="mt-8 bg-white rounded-3xl shadow-sm px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-center gap-3 mb-6">

            <div className="flex-1 bg-neutral-200 rounded-full flex items-center justify-between px-4 py-3 md:px-10">
              <div className="w-full flex text-lg font-semibold">
  {/* ALL = left aligned */}
  <button
    onClick={() => setActiveCategory('All')}
    className={`w-1/3 text-left pl-4 md:pl-10 transition ${
      activeCategory === 'All'
        ? 'text-neutral-900'
        : 'text-neutral-500'
    }`}
  >
    All
  </button>

  {/* SPORT = centered */}
  <button
    onClick={() => setActiveCategory('Sport')}
    className={`w-1/3 text-center transition ${
      activeCategory === 'Sport'
        ? 'text-neutral-900'
        : 'text-neutral-500'
    }`}
  >
    Sport
  </button>

  {/* CULTURE = right aligned */}
  <button
    onClick={() => setActiveCategory('Culture')}
    className={`w-1/3 text-right pr-4 md:pr-10 transition ${
      activeCategory === 'Culture'
        ? 'text-neutral-900'
        : 'text-neutral-500'
    }`}
  >
    Culture
  </button>
</div>
            </div>

            <button
              type="button"
              className="px-6 py-3 rounded-full border border-neutral-800 text-sm font-medium bg-white hover:bg-neutral-100 transition"
            >
              Filter
            </button>
          </div>

          {/* Clubs grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* No clubs message */}
            {filteredClubs.length === 0 && (
              <p className="text-neutral-400 text-sm">No clubs available.</p>
            )}

            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="flex flex-col items-center bg-neutral-100 rounded-3xl px-3 pt-4 pb-5"
              >
                <div className="w-full h-32 rounded-3xl bg-neutral-300 flex items-center justify-center text-sm text-neutral-600">
                  Image
                </div>

                <div className="mt-4 w-full flex justify-center">
                  <div className="inline-flex px-6 py-2 rounded-full bg-white border border-neutral-400 text-xs font-medium">
                    {club.name}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-3 text-[11px] px-6 py-2 rounded-full bg-white border border-neutral-300 hover:bg-neutral-100 transition"
                >
                  Details Button
                </button>

                <p className="mt-3 text-[11px] text-neutral-500 text-center">
                  {club.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Event = {
  eventID: number;
  clubID: number;
  clubName: string;
  description: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  date: string;
  month: string;
  year: string;
};

type Club = {
  clubID: number;
  clubName: string;
  category: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
  memberCount?: number;
  eventCount?: number;
};

const categories = ['All', 'Sport', 'Culture', 'Volunteer', 'Technology', 'Academic'] as const;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000/api';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>('All');

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch clubs from API
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        console.log('Fetching clubs from:', `${API_URL}/clubs`);
        const response = await fetch(`${API_URL}/clubs`);
        console.log('Clubs response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch clubs');
        const data = await response.json();
        console.log('Clubs data received:', data.length, 'clubs');
        setClubs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch clubs');
        console.error('Error fetching clubs:', err);
      }
    };

    fetchClubs();
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events from:', `${API_URL}/events`);
        const response = await fetch(`${API_URL}/events`);
        console.log('Events response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        console.log('Events data received:', data.length, 'events');
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter clubs by category
  const filteredClubs =
    activeCategory === 'All'
      ? clubs
      : clubs.filter((club) => club.category === activeCategory);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-6xl px-4 md:px-8 py-8">
        
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm rounded-2xl px-6 py-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-purple-600">ClubHub</h1>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-sm text-gray-700 hover:text-purple-600 transition">
                  Home
                </Link>
                <Link href="/clubs" className="text-sm text-gray-700 hover:text-purple-600 transition">
                  Clubs
                </Link>
                <Link href="/events" className="text-sm text-gray-700 hover:text-purple-600 transition">
                  Events
                </Link>
                {user && (
                  <>
                    <Link href="/messages" className="text-sm text-gray-700 hover:text-purple-600 transition">
                      Messages
                    </Link>
                    <Link href="/bookmarks" className="text-sm text-gray-700 hover:text-purple-600 transition">
                      Bookmarks
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    Welcome, {user.name || user.clubName || 'User'}
                  </span>
                  <Link 
                    href="/profile" 
                    className="text-sm px-4 py-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm px-4 py-2 rounded-full bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Top logo + app name */}
        <section className="flex flex-col items-center mt-8 mb-10">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-2xl text-white font-bold shadow-lg">
            CH
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold tracking-wide text-gray-900">ClubHub</h1>
            <p className="text-sm text-neutral-500 mt-2">
              Discover, Connect, and Engage with Student Clubs
            </p>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

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

              {events.map((event) => {
                const eventDate = new Date(event.eventDate);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                
                return (
                  <div
                    key={event.eventID}
                    className="min-w-[170px] bg-neutral-100 rounded-3xl shadow-sm px-3 py-3 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/clubs/${event.clubID}`)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="bg-rose-200 rounded-2xl px-3 py-2 flex flex-col items-center text-[10px] font-semibold text-neutral-700">
                        <span className="text-base leading-none">{day}</span>
                        <span className="mt-0.5 uppercase tracking-wide">
                          {month}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs font-medium text-neutral-800">
                          {event.eventLocation}
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {event.eventTime}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 bg-white rounded-3xl shadow-inner px-3 py-3 text-[11px] text-neutral-600 relative">
                      <p className="pr-4">{event.description}</p>
                      <span className="absolute right-2 bottom-2 text-[13px]">❤️</span>
                    </div>
                  </div>
                );
              })}
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
                key={club.clubID}
                className="flex flex-col items-center bg-neutral-100 rounded-3xl px-3 pt-4 pb-5 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/clubs/${club.clubID}`)}
              >
                <div className="w-full h-32 rounded-3xl bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center text-sm text-white font-semibold">
                  {club.clubName}
                </div>

                <div className="mt-4 w-full flex justify-center">
                  <div className="inline-flex px-6 py-2 rounded-full bg-white border border-neutral-400 text-xs font-medium">
                    {club.clubName}
                  </div>
                </div>

                <div className="mt-2 w-full flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-medium">
                    {club.category}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-3 text-[11px] px-6 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/clubs/${club.clubID}`);
                  }}
                >
                  View Details
                </button>

                <p className="mt-3 text-[11px] text-neutral-500 text-center line-clamp-2">
                  {club.description}
                </p>

                {club.meetingTime && club.meetingLocation && (
                  <div className="mt-2 text-[10px] text-neutral-400 text-center">
                    <p>{club.meetingTime}</p>
                    <p>{club.meetingLocation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000/api';

type Event = {
  eventID: number;
  clubID: number;
  description: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
};

type Club = {
  clubID: number;
  clubName: string;
};

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<{ [key: number]: Club }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    fetchEventsAndClubs();
  }, []);

  const fetchEventsAndClubs = async () => {
    try {
      // Fetch events
      const eventsResponse = await fetch(`${API_URL}/events`);
      if (!eventsResponse.ok) throw new Error('Failed to fetch events');
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);

      // Fetch clubs
      const clubsResponse = await fetch(`${API_URL}/clubs`);
      if (clubsResponse.ok) {
        const clubsData = await clubsResponse.json();
        const clubsMap: { [key: number]: Club } = {};
        clubsData.forEach((club: Club) => {
          clubsMap[club.clubID] = club;
        });
        setClubs(clubsMap);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      return eventDate >= today;
    } else if (filter === 'past') {
      return eventDate < today;
    }
    return true;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-neutral-600">Loading events...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link href="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-4">Events Calendar</h1>
          <p className="text-white/90 mt-2 text-lg">Discover upcoming club events and activities</p>
          <div className="mt-6">
            <div className="text-3xl font-bold">{sortedEvents.length}</div>
            <div className="text-sm text-white/80">
              {filter === 'upcoming' ? 'Upcoming Events' : filter === 'past' ? 'Past Events' : 'Total Events'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'upcoming'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'past'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Past Events
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Events
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Events List */}
        {sortedEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Events Found</h2>
            <p className="text-gray-600">
              {filter === 'upcoming' ? 'No upcoming events at the moment.' : 'No past events to display.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event) => {
              const eventDate = new Date(event.eventDate);
              const day = eventDate.getDate();
              const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
              const year = eventDate.getFullYear();
              const club = clubs[event.clubID];

              return (
                <div
                  key={event.eventID}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Date Badge */}
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg p-4 text-center min-w-[80px]">
                          <div className="text-3xl font-bold">{day}</div>
                          <div className="text-sm font-semibold">{month}</div>
                          <div className="text-xs opacity-90">{year}</div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            {club && (
                              <button
                                onClick={() => router.push(`/clubs/${event.clubID}`)}
                                className="text-sm font-semibold text-purple-600 hover:text-purple-700 mb-1 inline-block"
                              >
                                {club.clubName}
                              </button>
                            )}
                            <h3 className="text-xl font-bold text-gray-900">{event.description}</h3>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center text-gray-600">
                            <svg
                              className="w-5 h-5 mr-2 text-purple-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-medium">{event.eventTime}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg
                              className="w-5 h-5 mr-2 text-purple-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="font-medium">{event.eventLocation}</span>
                          </div>
                        </div>

                        {club && (
                          <div className="mt-4">
                            <button
                              onClick={() => router.push(`/clubs/${event.clubID}`)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm"
                            >
                              View Club Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

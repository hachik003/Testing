'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000/api';

type Club = {
  clubID: number;
  clubName: string;
  category: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
};

type Bookmark = {
  bookmarkID: number;
  studentID: number;
  clubID: number;
  bookmarkedAt: string;
  club?: Club;
};

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    if (!parsedUser.studentID) {
      setError('Only students can bookmark clubs');
      setLoading(false);
      return;
    }

    fetchBookmarks(parsedUser.studentID);
  }, [router]);

  const fetchBookmarks = async (studentID: number) => {
    try {
      const response = await fetch(`${API_URL}/students/${studentID}/bookmarks`);
      if (!response.ok) throw new Error('Failed to fetch bookmarks');
      const data = await response.json();

      // Fetch club details for each bookmark
      const bookmarksWithClubs = await Promise.all(
        data.map(async (bookmark: Bookmark) => {
          try {
            const clubResponse = await fetch(`${API_URL}/clubs/${bookmark.clubID}`);
            if (clubResponse.ok) {
              const club = await clubResponse.json();
              return { ...bookmark, club };
            }
            return bookmark;
          } catch {
            return bookmark;
          }
        })
      );

      setBookmarks(bookmarksWithClubs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (clubID: number) => {
    if (!user || !user.studentID) return;

    try {
      const response = await fetch(`${API_URL}/students/${user.studentID}/bookmarks/${clubID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookmarks(bookmarks.filter((b) => b.clubID !== clubID));
      } else {
        throw new Error('Failed to remove bookmark');
      }
    } catch (err) {
      console.error('Error removing bookmark:', err);
      alert('Failed to remove bookmark. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-neutral-600">Loading bookmarks...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-purple-600 hover:text-purple-700 mb-2 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
              <p className="text-gray-600 mt-1">Clubs you've saved for later</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{bookmarks.length}</div>
              <div className="text-sm text-gray-600">Saved Clubs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {bookmarks.length === 0 ? (
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookmarks Yet</h2>
            <p className="text-gray-600 mb-6">
              Start exploring clubs and bookmark your favorites to find them here.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Browse Clubs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.bookmarkID}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200"
              >
                <div className="p-6">
                  {bookmark.club ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {bookmark.club.category}
                        </span>
                        <button
                          onClick={() => handleRemoveBookmark(bookmark.clubID)}
                          className="text-yellow-500 hover:text-yellow-600 transition"
                          title="Remove bookmark"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      </div>
                      <h3
                        className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-purple-600 transition"
                        onClick={() => router.push(`/clubs/${bookmark.clubID}`)}
                      >
                        {bookmark.club.clubName}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{bookmark.club.description}</p>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {bookmark.club.meetingTime && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{bookmark.club.meetingTime}</span>
                          </div>
                        )}
                        {bookmark.club.meetingLocation && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <span>{bookmark.club.meetingLocation}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        Bookmarked {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => router.push(`/clubs/${bookmark.clubID}`)}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                      >
                        View Club
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Club information unavailable</p>
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.clubID)}
                        className="mt-4 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

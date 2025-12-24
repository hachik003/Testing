'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'http://localhost:5001/api';

type Club = {
  clubID: number;
  clubName: string;
  category: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
};

type Event = {
  eventID: number;
  clubID: number;
  description: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
};

type Media = {
  mediaID: number;
  clubID: number;
  mediaURL: string;
  caption: string;
  uploadedAt: string;
};

type Member = {
  memberID: number;
  studentID: number;
  clubID: number;
  studentName: string;
  joinedAt: string;
};

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clubID = params?.id as string;

  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'media' | 'members'>('about');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!clubID) return;

    const fetchClubDetails = async () => {
      try {
        // Fetch club info
        const clubResponse = await fetch(`${API_URL}/clubs/${clubID}`);
        if (!clubResponse.ok) throw new Error('Club not found');
        const clubData = await clubResponse.json();
        setClub(clubData);

        // Fetch events for this club
        const eventsResponse = await fetch(`${API_URL}/clubs/${clubID}/events`);
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData);
        }

        // Fetch media for this club
        const mediaResponse = await fetch(`${API_URL}/clubs/${clubID}/media`);
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          setMedia(mediaData);
        }

        // Fetch members for this club
        const membersResponse = await fetch(`${API_URL}/clubs/${clubID}/members`);
        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          setMembers(membersData);
        }

        // Check if bookmarked (if user is logged in)
        if (user && user.studentID) {
          const bookmarksResponse = await fetch(`${API_URL}/students/${user.studentID}/bookmarks`);
          if (bookmarksResponse.ok) {
            const bookmarks = await bookmarksResponse.json();
            setIsBookmarked(bookmarks.some((b: any) => b.clubID === parseInt(clubID)));
          }

          // Check if member
          const memberCheckResponse = await fetch(`${API_URL}/clubs/${clubID}/members`);
          if (memberCheckResponse.ok) {
            const membersData = await memberCheckResponse.json();
            setIsMember(membersData.some((m: Member) => m.studentID === user.studentID));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load club details');
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [clubID, user]);

  const handleBookmark = async () => {
    if (!user || !user.studentID) {
      router.push('/login');
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        await fetch(`${API_URL}/students/${user.studentID}/bookmarks/${clubID}`, {
          method: 'DELETE',
        });
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await fetch(`${API_URL}/students/${user.studentID}/bookmarks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clubID: parseInt(clubID) }),
        });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleJoinClub = async () => {
    if (!user || !user.studentID) {
      router.push('/login');
      return;
    }

    try {
      if (isMember) {
        // Leave club
        const member = members.find((m) => m.studentID === user.studentID);
        if (member) {
          await fetch(`${API_URL}/clubs/${clubID}/members/${member.memberID}`, {
            method: 'DELETE',
          });
          setIsMember(false);
          setMembers(members.filter((m) => m.memberID !== member.memberID));
        }
      } else {
        // Join club
        const response = await fetch(`${API_URL}/clubs/${clubID}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentID: user.studentID }),
        });
        if (response.ok) {
          setIsMember(true);
          // Refresh members list
          const membersResponse = await fetch(`${API_URL}/clubs/${clubID}/members`);
          if (membersResponse.ok) {
            const membersData = await membersResponse.json();
            setMembers(membersData);
          }
        }
      }
    } catch (err) {
      console.error('Error toggling membership:', err);
    }
  };

  const handleSendMessage = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/messages?clubID=${clubID}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-neutral-600">Loading club details...</div>
      </main>
    );
  }

  if (error || !club) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'Club not found'}</div>
          <Link href="/" className="text-purple-600 hover:text-purple-700">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/" className="text-white hover:text-gray-200 mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="flex items-start justify-between mt-4">
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm mb-3">
                {club.category}
              </div>
              <h1 className="text-4xl font-bold mb-2">{club.clubName}</h1>
              <p className="text-white/90 text-lg">{club.description}</p>
              <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>{members.length} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{events.length} Events</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {user && user.studentID && (
                <>
                  <button
                    onClick={handleBookmark}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      isBookmarked
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                  </button>
                  <button
                    onClick={handleJoinClub}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      isMember
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white text-purple-600 hover:bg-gray-100'
                    }`}
                  >
                    {isMember ? 'Leave Club' : 'Join Club'}
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'about'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'events'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Events ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'media'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Media ({media.length})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'members'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Members ({members.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {club.clubName}</h2>
                <p className="text-gray-700 leading-relaxed">{club.description}</p>
              </div>
              {club.meetingTime && club.meetingLocation && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Meeting Time</h3>
                    <p className="text-gray-600">{club.meetingTime}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Meeting Location</h3>
                    <p className="text-gray-600">{club.meetingLocation}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
              {events.length === 0 ? (
                <p className="text-gray-500">No events scheduled yet.</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.eventID}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{event.description}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {new Date(event.eventDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {event.eventTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                              {event.eventLocation}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
              {media.length === 0 ? (
                <p className="text-gray-500">No media posted yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {media.map((item) => (
                    <div key={item.mediaID} className="rounded-lg overflow-hidden shadow-md">
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">📷 Media</span>
                      </div>
                      {item.caption && (
                        <div className="p-3 bg-white">
                          <p className="text-sm text-gray-700">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Club Members</h2>
              {members.length === 0 ? (
                <p className="text-gray-500">No members yet. Be the first to join!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member) => (
                    <div
                      key={member.memberID}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                          {member.studentName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.studentName}</h3>
                          <p className="text-sm text-gray-500">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

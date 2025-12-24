'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000/api';

type Message = {
  messageID: number;
  senderID: number;
  senderType: 'student' | 'club';
  receiverID: number;
  receiverType: 'student' | 'club';
  messageText: string;
  sentAt: string;
  senderName?: string;
  receiverName?: string;
};

type Conversation = {
  otherUserID: number;
  otherUserType: 'student' | 'club';
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<'student' | 'club' | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchConversations(parsedUser);

    // Check if clubID is in URL params (from club detail page)
    const clubID = searchParams?.get('clubID');
    if (clubID) {
      setSelectedConversation(parseInt(clubID));
      setSelectedType('club');
      fetchMessages(parsedUser, parseInt(clubID), 'club');
    }

    setLoading(false);
  }, [router, searchParams]);

  const fetchConversations = async (userData: any) => {
    // This is a simplified version - in production, you'd have a dedicated endpoint
    // For now, we'll just show a placeholder
    setConversations([]);
  };

  const fetchMessages = async (userData: any, otherID: number, otherType: 'student' | 'club') => {
    try {
      const userType = userData.studentID ? 'student' : 'club';
      const userID = userData.studentID || userData.clubID;
      
      const response = await fetch(
        `${API_URL}/messages/${userType}/${userID}?otherID=${otherID}&otherType=${otherType}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedConversation || !selectedType) return;

    setSending(true);
    try {
      const userType = user.studentID ? 'student' : 'club';
      const userID = user.studentID || user.clubID;

      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderID: userID,
          senderType: userType,
          receiverID: selectedConversation,
          receiverType: selectedType,
          messageText: newMessage,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const sentMessage = await response.json();
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (id: number, type: 'student' | 'club') => {
    setSelectedConversation(id);
    setSelectedType(type);
    if (user) {
      fetchMessages(user, id, type);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-neutral-600">Loading messages...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-purple-600 hover:text-purple-700 mb-2 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">Chat with clubs and other students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              </div>
              {conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Start messaging clubs to see conversations here
                  </p>
                </div>
              ) : (
                <div>
                  {conversations.map((conv) => (
                    <div
                      key={`${conv.otherUserType}-${conv.otherUserID}`}
                      onClick={() => handleSelectConversation(conv.otherUserID, conv.otherUserType)}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${
                        selectedConversation === conv.otherUserID && selectedType === conv.otherUserType
                          ? 'bg-purple-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                          {conv.otherUserName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">{conv.otherUserName}</h3>
                            {conv.unreadCount > 0 && (
                              <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(conv.lastMessageTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation && selectedType ? (
                <>
                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-12">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const userType = user.studentID ? 'student' : 'club';
                        const userID = user.studentID || user.clubID;
                        const isSender =
                          message.senderType === userType && message.senderID === userID;

                        return (
                          <div
                            key={message.messageID}
                            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                isSender
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              <p>{message.messageText}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isSender ? 'text-purple-200' : 'text-gray-500'
                                }`}
                              >
                                {new Date(message.sentAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

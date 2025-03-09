'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import moment from 'moment';

export default function Chats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await axios.get('/chats');
      setChats(res.data.data);
    } catch (error) {
      toast.error('Error fetching chats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Messages</h1>

        {chats.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start chatting with food donors or requesters.
            </p>
            <div className="mt-6">
              <Link
                href="/food-donations"
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Browse Food Donations
              </Link>
            </div>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-100 bg-white shadow-sm rounded-lg">
            {chats.map((chat) => {
              const otherParticipant = chat.participants.find((p) => p._id !== user._id);
              const lastMessage = chat.messages[chat.messages.length - 1];
              const hasUnreadMessages = chat.messages.some(
                (msg) => !msg.read && msg.sender._id !== user._id
              );

              return (
                <li key={chat._id}>
                  <Link href={`/chats/${chat._id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={otherParticipant.avatar}
                            alt={otherParticipant.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="ml-4">
                            <p
                              className={`text-sm font-medium ${
                                hasUnreadMessages ? 'text-green-600' : 'text-gray-900'
                              }`}
                            >
                              {otherParticipant.name}
                            </p>
                            {chat.foodPost && (
                              <p className="text-xs text-gray-500">Re: {chat.foodPost.title}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-xs text-gray-500">
                            {moment(chat.lastMessage).fromNow()}
                          </p>
                          {hasUnreadMessages && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      {lastMessage && (
                        <p className="mt-2 text-sm text-gray-500 truncate">
                          {lastMessage.sender._id === user._id ? 'You: ' : ''}
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
} 
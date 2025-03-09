'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import moment from 'moment';

export default function ChatDetail({ params }) {
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchChat();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [params.id]);

  const setupSocket = () => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join', params.id);
    });

    socketRef.current.on('message', (data) => {
      setChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, data]
      }));
    });
  };

  const fetchChat = async () => {
    try {
      const res = await axios.get(`/chats/${params.id}`);
      setChat(res.data.data);
      markAsRead();
    } catch (error) {
      toast.error('Error fetching chat');
      router.push('/chats');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await axios.put(`/chats/${params.id}/read`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await axios.post(`/chats/${params.id}/messages`, {
        content: message
      });
      socketRef.current.emit('message', {
        room: params.id,
        ...res.data.data
      });
      setMessage('');
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!chat) {
    return null;
  }

  const otherParticipant = chat.participants.find((p) => p._id !== user._id);

  return (
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <div className="flex items-center px-4 py-3 border-b bg-white">
        <img
          src={otherParticipant.avatar}
          alt={otherParticipant.name}
          className="h-10 w-10 rounded-full mr-3"
        />
        <div>
          <h2 className="text-lg font-semibold">{otherParticipant.name}</h2>
          {chat.foodPost && (
            <p className="text-sm text-gray-500">
              Re: {chat.foodPost.title}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chat.messages.map((msg) => {
          const isOwnMessage = msg.sender._id === user._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isOwnMessage
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-green-100' : 'text-gray-500'
                  }`}
                >
                  {moment(msg.createdAt).fromNow()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 
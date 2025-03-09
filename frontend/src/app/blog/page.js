'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import moment from 'moment';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/blogs');
      setBlogs(res.data.data);
    } catch (error) {
      toast.error('Error fetching blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId) => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      await axios.put(`/blogs/${blogId}/like`);
      fetchBlogs();
    } catch (error) {
      toast.error('Error liking post');
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Community Blog</h1>
          {user && (
            <Link
              href="/blog/create"
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Write a Post
            </Link>
          )}
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No blog posts yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to share your thoughts and experiences.
            </p>
            {user ? (
              <div className="mt-6">
                <Link
                  href="/blog/create"
                  className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Write Your First Post
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Login to Write
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white shadow-sm rounded-lg overflow-hidden"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      src={blog.user.avatar}
                      alt={blog.user.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{blog.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {moment(blog.createdAt).format('MMMM D, YYYY')}
                      </p>
                    </div>
                  </div>
                  <Link href={`/blog/${blog._id}`}>
                    <h2 className="mt-4 text-xl font-semibold text-gray-900 hover:text-green-600">
                      {blog.title}
                    </h2>
                  </Link>
                  <p className="mt-2 text-gray-600 line-clamp-3">{blog.content}</p>
                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(blog._id)}
                      className="flex items-center text-gray-500 hover:text-green-600"
                    >
                      {blog.likes.includes(user?._id) ? (
                        <HeartIconSolid className="h-5 w-5 text-green-600" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                      <span className="ml-1.5 text-sm">{blog.likes.length}</span>
                    </button>
                    <Link
                      href={`/blog/${blog._id}`}
                      className="flex items-center text-gray-500 hover:text-green-600"
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span className="ml-1.5 text-sm">{blog.comments.length}</span>
                    </Link>
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
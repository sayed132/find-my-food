'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import moment from 'moment';

export default function BlogDetail({ params }) {
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchBlog();
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/blogs/${params.id}`);
      setBlog(res.data.data);
    } catch (error) {
      toast.error('Error fetching blog post');
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      await axios.put(`/blogs/${params.id}/like`);
      fetchBlog();
    } catch (error) {
      toast.error('Error liking post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!comment.trim()) return;

    try {
      await axios.post(`/blogs/${params.id}/comments`, { text: comment });
      setComment('');
      fetchBlog();
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {blog.image && (
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={blog.user.avatar}
              alt={blog.user.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{blog.user.name}</p>
              <p className="text-xs text-gray-500">
                {moment(blog.createdAt).format('MMMM D, YYYY')}
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          <div className="prose max-w-none mb-6">{blog.content}</div>

          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={handleLike}
              className="flex items-center text-gray-500 hover:text-green-600"
            >
              {blog.likes.includes(user?._id) ? (
                <HeartIconSolid className="h-6 w-6 text-green-600" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
              <span className="ml-2 text-sm">{blog.likes.length} likes</span>
            </button>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-green-50 px-3 py-0.5 text-sm font-medium text-green-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>

            {user ? (
              <form onSubmit={handleComment} className="mb-6">
                <div>
                  <label htmlFor="comment" className="sr-only">
                    Add your comment
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="Add your comment..."
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-md bg-yellow-50 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Please login to comment
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        <a
                          href="/login"
                          className="font-medium text-yellow-800 underline hover:text-yellow-600"
                        >
                          Login
                        </a>{' '}
                        or{' '}
                        <a
                          href="/register"
                          className="font-medium text-yellow-800 underline hover:text-yellow-600"
                        >
                          register
                        </a>{' '}
                        to join the discussion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {blog.comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {comment.user.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {moment(comment.createdAt).fromNow()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
} 
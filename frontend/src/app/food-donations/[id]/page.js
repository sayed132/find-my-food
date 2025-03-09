'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { MapPinIcon, ClockIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function FoodDonationDetail({ params }) {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchDonation();
  }, [params.id]);

  const fetchDonation = async () => {
    try {
      const res = await axios.get(`/food-posts/${params.id}`);
      setDonation(res.data.data);
    } catch (error) {
      toast.error('Error fetching donation details');
      router.push('/food-donations');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    try {
      await axios.put(`/food-posts/${params.id}/assign`);
      toast.success('Request sent successfully!');
      fetchDonation();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error sending request');
    }
  };

  const handleStartChat = async () => {
    try {
      const res = await axios.post('/chats', {
        participant: donation.user._id,
        foodPost: donation._id
      });
      router.push(`/chats/${res.data.data._id}`);
    } catch (error) {
      toast.error('Error starting chat');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!donation) {
    return null;
  }

  const isOwner = user && donation.user._id === user._id;
  const isAssigned = donation.assignedTo && donation.assignedTo._id === user?._id;
  const isAvailable = donation.status === 'available';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          {donation.images && donation.images.length > 0 && (
            <div className="relative h-64 sm:h-96">
              <img
                src={donation.images[0]}
                alt={donation.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{donation.title}</h2>
              <div className="flex items-center space-x-4">
                {!isOwner && user && (
                  <>
                    <button
                      onClick={handleStartChat}
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                      Chat
                    </button>
                    {isAvailable && (
                      <button
                        onClick={handleRequest}
                        className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      >
                        Request Food
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Food Type</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {donation.foodType}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Quantity</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {donation.quantity}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Description</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {donation.description}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
                  <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        donation.status === 'available'
                          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                          : donation.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                          : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
                      }`}
                    >
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Expiry Time</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                      {moment(donation.expiryTime).format('MMMM Do YYYY, h:mm a')} (
                      {moment(donation.expiryTime).fromNow()})
                    </div>
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Location</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                      {donation.location.address}
                    </div>
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Donor</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex items-center">
                      <img
                        src={donation.user.avatar}
                        alt={donation.user.name}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      {donation.user.name}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import axios from '@/lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

export default function FoodDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      if (user && user.location) {
        const { coordinates } = user.location;
        const res = await axios.get('/food-posts', {
          params: {
            type: 'donation',
            lat: coordinates[1],
            lng: coordinates[0],
            radius: 5
          }
        });
        setDonations(res.data.data);
      }
    } catch (error) {
      toast.error('Error fetching donations');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-bold tracking-tight text-green-600 sm:text-5xl">
              Please login
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  to view food donations
                </h1>
                <p className="mt-1 text-base text-gray-500">
                  You need to be logged in to access this page.
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-sm font-semibold text-green-600 shadow-sm hover:bg-green-100"
                >
                  Register
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Food Donations</h1>
          <Link
            href="/food-donations/create"
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Donate Food
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="mt-8 text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No donations</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no food donations in your area yet.
            </p>
            <div className="mt-6">
              <Link
                href="/food-donations/create"
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Be the first to donate
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {donations.map((donation) => (
              <Link
                key={donation._id}
                href={`/food-donations/${donation._id}`}
                className="relative block overflow-hidden rounded-lg border border-gray-200 bg-white p-4 hover:border-green-500 transition-colors"
              >
                {donation.images && donation.images.length > 0 && (
                  <img
                    src={donation.images[0]}
                    alt={donation.title}
                    className="h-48 w-full object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-900">{donation.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{donation.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{donation.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>Expires {moment(donation.expiryTime).fromNow()}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <img
                    src={donation.user.avatar}
                    alt={donation.user.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm text-gray-500">{donation.user.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
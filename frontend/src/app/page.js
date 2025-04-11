import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const features = [
  {
    name: "Food Donations",
    description:
      "Share your excess food with those who need it. Easy to post and manage your donations.",
    href: "/food-donations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
  },
  {
    name: "Food Requests",
    description:
      "Request food assistance from your community. Simple and dignified process.",
    href: "/food-requests",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9"
        />
      </svg>
    ),
  },
  {
    name: "Community Blog",
    description:
      "Share stories, tips, and experiences about food sharing and community building.",
    href: "/blog",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-green-50 via-green-100 to-white ">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-green-500/40">
        <div className="mx-auto max-w-7xl pb-24 pt-20 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <h1 className="mt-10 text-5xl font-extrabold tracking-tight text-green-400 sm:text-6xl">
                Share Food, Share Love
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Connect with your community to share excess food and help those
                in need. Reduce food waste and make a difference in someone's
                life today.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/food-donations"
                  className="rounded-full bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-xl hover:bg-green-500 transition-all duration-300 ease-in-out"
                >
                  Donate Food
                </Link>
                <Link
                  href="/food-requests"
                  className="text-lg font-semibold leading-6 text-green-500 hover:text-green-600 transition-all duration-300 ease-in-out"
                >
                  Request Food{" "}
                  <ArrowRightIcon className="h-5 w-5 inline-block" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-green-600/10 ring-1 ring-green-50 md:-mr-20 lg:-mr-36" />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-green-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-green-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <img
                      src="/appSS.png"
                      alt="App screenshot"
                      className="w-full rounded-xl shadow-xl ring-2 ring-white/30 hover:scale-105 transition-all duration-500 ease-in-out"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto mt-32 pb-12 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">
            Better Together
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to share food with your community
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform makes it easy to connect food donors with those in
            need, creating a more sustainable and caring community.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  {feature.icon}
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-green-600 hover:text-green-800 transition-all duration-300 ease-in-out"
                    >
                      Learn more{" "}
                      <ArrowRightIcon className="h-5 w-5 inline-block" />
                    </Link>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Buttons from './components/Buttons';
import Weather from './components/Weather';
import News from './components/News';
import Navbar from './components/Navbar';
import PaymentForm from './components/PaymentForm';

const Page = () => {
  const [search, setSearch] = useState('Nairobi');
  const [selectedTab, setSelectedTab] = useState('weather');
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true); // loading state

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar if clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setShowSidebar(false);
      }
    };

    if (showSidebar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidebar]);

  // Simulate loading
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 animate-pulse flex flex-col p-4">
        <div className="h-12 w-1/3 bg-gray-300 rounded mb-6" />
        <div className="flex flex-1">
          {/* Sidebar Skeleton */}
          <div className="w-64 hidden md:block space-y-4 pr-4">
            <div className="h-10 bg-gray-300 rounded" />
            <div className="h-10 bg-gray-300 rounded" />
            <div className="h-10 bg-gray-300 rounded" />
            <div className="h-10 bg-gray-300 rounded" />
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/2" />
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar
        setSearch={setSearch}
        toggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`
            fixed top-0 left-0 z-40 w-64 h-screen p-4 bg-white shadow-md
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:relative md:sticky md:top-0 md:block md:h-screen
            md:shadow-none md:bg-transparent
          `}
        >
          <Buttons
            selectedTab={selectedTab}
            onTabSelect={(tab) => {
              setSelectedTab(tab);
              setShowSidebar(false);
            }}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 lg:p-6 flex justify-center">
          <div className="w-full max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {selectedTab === 'weather' && <Weather search={search} />}
            {selectedTab === 'news' && <News search={search} />}
            {selectedTab === 'donate' && <PaymentForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
















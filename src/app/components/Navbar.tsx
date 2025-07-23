'use client';
import React, { useState } from 'react';
import { HiMenu } from 'react-icons/hi';

interface NavbarProps {
  setSearch: (val: string) => void;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ setSearch, toggleSidebar }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(query);
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-white shadow-md flex items-center px-4 md:px-6">
      {/* Hamburger + Brand */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
        >
          <HiMenu />
        </button>
        <div className="text-xl font-bold text-gray-800">Dash</div>
      </div>

      {/* Search Form on the right */}
      <form onSubmit={handleSearch} className="ml-auto">
        <div className="flex space-x-2 max-w-md w-full">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Search
          </button>
        </div>
      </form>
    </nav>
  );
};

export default Navbar;









'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdOutlineArticle } from 'react-icons/md';
import { FaGlobeAmericas } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';

const News = ({ search }: { search: string }) => {
  const [news, setNews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/news?q=${search}`);
        setNews(response.data.articles);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (search) fetchData();
  }, [search]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
        <FaGlobeAmericas className="text-blue-500" size={28} />
        Top News Headlines
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-5 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : Array.isArray(news) && news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-transform hover:scale-105 border border-gray-100"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MdOutlineArticle className="text-blue-400" />
                  <span className="text-sm font-medium">
                    {article.source?.name || 'Unknown Source'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {article.description || 'No description available.'}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
                >
                  Read more <HiExternalLink />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No news found.</p>
      )}
    </div>
  );
};

export default News;






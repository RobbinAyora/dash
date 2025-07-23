'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoPartlySunnyOutline, IoThermometerOutline } from 'react-icons/io5';
import { WiHumidity } from 'react-icons/wi';
import { FaWind } from 'react-icons/fa6';
import { MdOutlineWbCloudy } from 'react-icons/md';

const SkeletonBox = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded-md ${className}`}></div>
);

const Weather = ({ search }: { search: string }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!search) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`
        );
        setData(response.data);
      } catch (err) {
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search]);

  if (loading || !data) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col gap-8 w-[90%]">
        {/* Skeleton Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <SkeletonBox className="h-6 w-1/2" />
          <SkeletonBox className="h-24 w-24 rounded-full" />
          <SkeletonBox className="h-10 w-32" />
        </div>

        {/* Skeleton Details */}
        <div className="grid grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm"
            >
              <SkeletonBox className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-2">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col gap-8 w-[90%]">
      {/* Top Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-3xl font-bold text-blue-700">Weather in {data.name}</h2>
        <IoPartlySunnyOutline className="text-yellow-400 text-[6rem]" />
        <div className="text-4xl font-semibold text-gray-800 flex items-center gap-2">
          <IoThermometerOutline className="text-red-500 text-3xl" />
          {data.main.temp}°C
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-2 gap-6 text-gray-700 text-base">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
          <MdOutlineWbCloudy className="text-blue-500 text-2xl" />
          <div>
            <p className="font-semibold">Condition</p>
            <p className="capitalize text-sm text-gray-500">{data.weather[0].description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
          <WiHumidity className="text-teal-500 text-3xl" />
          <div>
            <p className="font-semibold">Humidity</p>
            <p className="text-sm text-gray-500">{data.main.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
          <FaWind className="text-indigo-500 text-lg" />
          <div>
            <p className="font-semibold">Wind Speed</p>
            <p className="text-sm text-gray-500">{data.wind.speed} m/s</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
          <IoThermometerOutline className="text-orange-500 text-xl" />
          <div>
            <p className="font-semibold">Feels Like</p>
            <p className="text-sm text-gray-500">{data.main.feels_like}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;








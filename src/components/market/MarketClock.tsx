import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

interface MarketSchedule {
  name: string;
  timezone: string;
  status: 'open' | 'closed';
  hours: string;
  nextEvent: string;
}

const marketSchedules: MarketSchedule[] = [
  {
    name: 'NYSE',
    timezone: 'EST',
    status: 'open',
    hours: '9:30 AM - 4:00 PM',
    nextEvent: 'Closes in 2h 15m'
  },
  {
    name: 'London',
    timezone: 'GMT',
    status: 'closed',
    hours: '8:00 AM - 4:30 PM',
    nextEvent: 'Opens in 10h 30m'
  },
  {
    name: 'Tokyo',
    timezone: 'JST',
    status: 'open',
    hours: '9:00 AM - 3:00 PM',
    nextEvent: 'Closes in 4h 45m'
  },
  {
    name: 'Crypto',
    timezone: '24/7',
    status: 'open',
    hours: 'Always Open',
    nextEvent: 'Never closes'
  }
];

export default function MarketClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Market Hours
        </h3>
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Global Markets
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-gray-900 dark:text-white font-mono">
          {time.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {time.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {marketSchedules.map((market) => (
          <div 
            key={market.name}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {market.name}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                market.status === 'open'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {market.status.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {market.hours}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {market.nextEvent}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { TrendingUp, TrendingDown, Zap, Star, BarChart2 } from 'lucide-react';

interface TrendingAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  trending: number;
}

const mockTrendingAssets: TrendingAsset[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 45000,
    change24h: 2.5,
    volume: 28000000000,
    trending: 98
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2800,
    change24h: -1.2,
    volume: 15000000000,
    trending: 95
  },
  {
    id: '3',
    symbol: 'SOL',
    name: 'Solana',
    price: 98,
    change24h: 5.8,
    volume: 3000000000,
    trending: 92
  },
  {
    id: '4',
    symbol: 'MATIC',
    name: 'Polygon',
    price: 1.2,
    change24h: 3.4,
    volume: 1500000000,
    trending: 88
  }
];

export default function TrendingAssets() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Trending Assets
        </h3>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-lg text-sm">
            Real-time
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {mockTrendingAssets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {asset.symbol}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {asset.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${asset.price.toLocaleString()}
                  </span>
                  <span className={`flex items-center text-sm ${
                    asset.change24h >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {asset.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(asset.change24h)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Volume 24h
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  ${(asset.volume / 1000000000).toFixed(1)}B
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {asset.trending}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
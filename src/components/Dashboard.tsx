import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Percent, Brain, Zap, TrendingUp } from 'lucide-react';
import { Performance } from '../types/trading';
import AgentPerformanceChart from './charts/AgentPerformanceChart';
import ProfitMetrics from './metrics/ProfitMetrics';
import ActiveAgentsGrid from './agents/ActiveAgentsGrid';

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-300" />
            </div>
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +24.5%
            </span>
          </div>
          <h3 className="text-sm text-gray-300">Total Profit</h3>
          <p className="text-2xl font-bold text-white mt-1">$158,942.67</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/90 to-cyan-900/90 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <Brain className="w-6 h-6 text-blue-300" />
            </div>
            <span className="text-blue-300 text-sm">12 Active</span>
          </div>
          <h3 className="text-sm text-gray-300">AI Agents</h3>
          <p className="text-2xl font-bold text-white mt-1">92% Success</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/90 to-teal-900/90 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-300" />
            </div>
            <span className="text-emerald-300 text-sm">Real-time</span>
          </div>
          <h3 className="text-sm text-gray-300">Win Rate</h3>
          <p className="text-2xl font-bold text-white mt-1">78.5%</p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/90 to-orange-900/90 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <Zap className="w-6 h-6 text-amber-300" />
            </div>
            <span className="text-amber-300 text-sm">24h Volume</span>
          </div>
          <h3 className="text-sm text-gray-300">Trading Volume</h3>
          <p className="text-2xl font-bold text-white mt-1">$2.8M</p>
        </div>
      </div>

      {/* Main Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900/50 rounded-xl p-6 shadow-xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Performance Overview</h2>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                +18.4% This Month
              </span>
            </div>
          </div>
          <div className="h-80">
            <AgentPerformanceChart />
          </div>
        </div>

        {/* Top Performing Agents */}
        <div className="bg-gray-900/50 rounded-xl p-6 shadow-xl border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Top Agents</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-900/50 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Quantum AI</p>
                  <p className="text-sm text-gray-400">94.2% Success</p>
                </div>
              </div>
              <span className="text-green-400">+$45.8k</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-900/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">DeFi Oracle</p>
                  <p className="text-sm text-gray-400">91.7% Success</p>
                </div>
              </div>
              <span className="text-green-400">+$38.2k</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-900/50 rounded-lg">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Forex Master</p>
                  <p className="text-sm text-gray-400">88.9% Success</p>
                </div>
              </div>
              <span className="text-green-400">+$31.5k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Agents Grid */}
      <div className="bg-gray-900/50 rounded-xl p-6 shadow-xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Active Trading Agents</h2>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Manage Agents
          </button>
        </div>
        <ActiveAgentsGrid />
      </div>
    </div>
  );
}
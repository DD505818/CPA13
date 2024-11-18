import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SystemStatus {
  database: 'healthy' | 'warning' | 'error' | 'unknown';
  trading: 'healthy' | 'warning' | 'error' | 'unknown';
  agents: 'healthy' | 'warning' | 'error' | 'unknown';
  memory: 'healthy' | 'warning' | 'error' | 'unknown';
  lastUpdate: number;
}

export default function HealthMonitor() {
  const [status, setStatus] = useState<SystemStatus>({
    database: 'unknown',
    trading: 'unknown',
    agents: 'unknown',
    memory: 'unknown',
    lastUpdate: Date.now()
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Simulate health check - replace with actual health check logic
        const newStatus: SystemStatus = {
          database: Math.random() > 0.9 ? 'warning' : 'healthy',
          trading: Math.random() > 0.95 ? 'error' : 'healthy',
          agents: Math.random() > 0.8 ? 'warning' : 'healthy',
          memory: Math.random() > 0.85 ? 'warning' : 'healthy',
          lastUpdate: Date.now()
        };
        setStatus(newStatus);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6" />
          System Health
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(status.lastUpdate).toLocaleTimeString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(status).map(([key, value]) => {
          if (key === 'lastUpdate') return null;
          return (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                  {key}
                </span>
                {getStatusIcon(value)}
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-lg text-sm ${getStatusColor(value)}`}>
                  {value.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
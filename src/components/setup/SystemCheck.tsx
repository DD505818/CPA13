import React, { useState, useEffect } from 'react';
import { Check, X, Loader } from 'lucide-react';

interface SystemCheckProps {
  onComplete: () => void;
}

interface CheckResult {
  name: string;
  status: 'checking' | 'success' | 'error';
  message?: string;
}

export default function SystemCheck({ onComplete }: SystemCheckProps) {
  const [checks, setChecks] = useState<CheckResult[]>([
    { name: 'Database Connection', status: 'checking' },
    { name: 'Network Connectivity', status: 'checking' },
    { name: 'System Resources', status: 'checking' },
    { name: 'API Access', status: 'checking' }
  ]);

  useEffect(() => {
    const runChecks = async () => {
      for (let i = 0; i < checks.length; i++) {
        await simulateCheck(i);
      }
      const allPassed = checks.every((check) => check.status === 'success');
      if (allPassed) {
        setTimeout(onComplete, 1000);
      }
    };

    runChecks();
  }, []);

  const simulateCheck = async (index: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setChecks((prev) =>
      prev.map((check, i) =>
        i === index
          ? { ...check, status: Math.random() > 0.1 ? 'success' : 'error' }
          : check
      )
    );
  };

  return (
    <div className="space-y-4">
      {checks.map((check) => (
        <div
          key={check.name}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div className="flex items-center">
            <div className="mr-4">
              {check.status === 'checking' && (
                <Loader className="w-5 h-5 text-blue-500 animate-spin" />
              )}
              {check.status === 'success' && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {check.status === 'error' && (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {check.name}
              </p>
              {check.message && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {check.message}
                </p>
              )}
            </div>
          </div>
          <span
            className={`text-sm ${
              check.status === 'checking'
                ? 'text-blue-500'
                : check.status === 'success'
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {check.status === 'checking'
              ? 'Checking...'
              : check.status === 'success'
              ? 'Passed'
              : 'Failed'}
          </span>
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { Check } from 'lucide-react';

interface SetupStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isActive: boolean;
  children?: React.ReactNode;
}

export default function SetupStep({
  title,
  description,
  icon,
  isCompleted,
  isActive,
  children
}: SetupStepProps) {
  return (
    <div className="relative">
      <div className="flex items-center mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center
            ${
              isCompleted
                ? 'bg-green-500'
                : isActive
                ? 'bg-blue-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
        >
          {isCompleted ? (
            <Check className="w-6 h-6 text-white" />
          ) : (
            <span className="text-white">{icon}</span>
          )}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="ml-14">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
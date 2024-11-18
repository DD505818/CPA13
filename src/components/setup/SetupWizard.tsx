import React, { useState } from 'react';
import { Check, ChevronRight, Settings, Shield, Wallet } from 'lucide-react';
import SetupStep from './SetupStep';
import SystemCheck from './SystemCheck';
import SecuritySetup from './SecuritySetup';
import WalletSetup from './WalletSetup';

export type SetupStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const steps: SetupStep[] = [
    {
      id: 'system',
      title: 'System Check',
      description: 'Verify system requirements and connectivity',
      icon: <Settings className="w-6 h-6" />,
      component: <SystemCheck onComplete={() => handleComplete('system')} />
    },
    {
      id: 'security',
      title: 'Security Setup',
      description: 'Configure security settings and preferences',
      icon: <Shield className="w-6 h-6" />,
      component: <SecuritySetup onComplete={() => handleComplete('security')} />
    },
    {
      id: 'wallet',
      title: 'Wallet Configuration',
      description: 'Set up your trading wallet',
      icon: <Wallet className="w-6 h-6" />,
      component: <WalletSetup onComplete={() => handleComplete('wallet')} />
    }
  ];

  const handleComplete = (stepId: string) => {
    if (!completed.includes(stepId)) {
      setCompleted([...completed, stepId]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to DDGPT Trading
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Let's get your trading environment set up
          </p>
        </div>

        <div className="mb-8">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative ${
                  index !== steps.length - 1 ? 'pb-8' : ''
                }`}
              >
                {index !== steps.length - 1 && (
                  <div className="absolute left-6 top-14 -ml-px h-full w-0.5 bg-gray-300 dark:bg-gray-600" />
                )}
                <div className="relative flex items-start group">
                  <div className="flex items-center h-12">
                    <span
                      className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full 
                        ${
                          completed.includes(step.id)
                            ? 'bg-green-500'
                            : currentStep === index
                            ? 'bg-blue-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    >
                      {completed.includes(step.id) ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white">{step.icon}</span>
                      )}
                    </span>
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                  {currentStep === index && !completed.includes(step.id) && (
                    <div className="ml-4 flex items-center">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                {currentStep === index && (
                  <div className="mt-4 ml-16">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                      {step.component}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
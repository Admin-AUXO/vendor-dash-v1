import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, TrendingUp, Database, Layers, BarChart3 } from 'lucide-react';
import { cn } from '../../ui/utils';

interface LoadingScreenProps {
  screenName?: string;
  screenIcon?: React.ComponentType<{ className?: string }>;
  isInitialLoad?: boolean;
  className?: string;
}

// Contextual loading messages based on screen
const loadingMessages: Record<string, { messages: string[]; icon: React.ComponentType<{ className?: string }> }> = {
  overview: {
    messages: [
      'Analyzing dashboard metrics...',
      'Compiling performance data...',
      'Loading revenue insights...',
      'Preparing work order summaries...',
      'Gathering activity feed...',
    ],
    icon: BarChart3,
  },
  'work-orders': {
    messages: [
      'Fetching work orders...',
      'Organizing by priority...',
      'Loading service details...',
      'Preparing workflow data...',
      'Syncing technician assignments...',
    ],
    icon: Layers,
  },
  invoice: {
    messages: [
      'Loading invoice records...',
      'Calculating outstanding amounts...',
      'Processing payment status...',
      'Organizing billing data...',
      'Preparing invoice summaries...',
    ],
    icon: TrendingUp,
  },
  payments: {
    messages: [
      'Fetching payment history...',
      'Processing transaction data...',
      'Calculating totals...',
      'Loading payment methods...',
      'Syncing financial records...',
    ],
    icon: Database,
  },
  marketplace: {
    messages: [
      'Loading marketplace projects...',
      'Fetching available bids...',
      'Processing project details...',
      'Organizing opportunities...',
      'Syncing marketplace data...',
    ],
    icon: Sparkles,
  },
  'help-desk': {
    messages: [
      'Loading support tickets...',
      'Fetching ticket details...',
      'Processing responses...',
      'Organizing help desk data...',
      'Syncing support information...',
    ],
    icon: Zap,
  },
};

const defaultMessages = {
  messages: [
    'Loading your data...',
    'Preparing dashboard...',
    'Almost ready...',
    'Setting things up...',
  ],
  icon: Database,
};

export function LoadingScreen({ 
  screenName, 
  screenIcon: _screenIcon, 
  isInitialLoad = false,
  className 
}: LoadingScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const screenConfig = screenName ? loadingMessages[screenName] || defaultMessages : defaultMessages;
  const messages = screenConfig.messages;
  const currentMessage = messages[currentMessageIndex];

  // Rotate through messages
  useEffect(() => {
    if (messages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-gradient-to-br from-gray-50 via-white to-gray-50',
        'backdrop-blur-sm',
        className
      )}
    >
      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 px-4">
        {/* Single spinning loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
        </div>

        {/* Message text with fade animation */}
        <div className="text-center space-y-2 min-h-[60px]">
          <p
            key={currentMessageIndex}
            className="text-lg font-semibold text-gray-800 animate-fade-in"
          >
            {currentMessage}
          </p>
          {isInitialLoad && (
            <p className="text-sm text-gray-500">
              This may take a few moments...
            </p>
          )}
        </div>
      </div>

    </div>
  );
}


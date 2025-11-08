import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, Zap, TrendingUp, Database, Layers, BarChart3 } from 'lucide-react';
import { cn } from '../ui/utils';

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
  screenIcon, 
  isInitialLoad = false,
  className 
}: LoadingScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const screenConfig = screenName ? loadingMessages[screenName] || defaultMessages : defaultMessages;
  const messages = screenConfig.messages;
  const Icon = screenIcon || screenConfig.icon;
  const currentMessage = messages[currentMessageIndex];

  // Rotate through messages
  useEffect(() => {
    if (messages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  // Simulate progress with smoother increments
  useEffect(() => {
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += Math.random() * 8 + 2; // Increment by 2-10%
      if (progressValue >= 90) {
        progressValue = 90; // Cap at 90% until actually loaded
        clearInterval(interval);
      }
      setProgress(progressValue);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-gradient-to-br from-gray-50 via-white to-gray-50',
        'backdrop-blur-sm',
        className
      )}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10 animate-float"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
        {/* Icon container with animated ring */}
        <div className="relative">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          
          {/* Icon container */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border-2 border-primary/30 shadow-lg">
            <Icon className="w-12 h-12 text-primary animate-pulse" />
          </div>

          {/* Rotating sparkles */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-primary animate-spin-slow" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles className="w-5 h-5 text-primary/70 animate-spin-slow-reverse" />
          </div>
        </div>

        {/* Loading spinner */}
        <div className="relative">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary animate-ping" />
          </div>
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
            <p className="text-sm text-gray-500 animate-pulse">
              This may take a few moments...
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-64 max-w-[80vw] space-y-2">
          <div className="h-2.5 bg-gray-200/60 rounded-full overflow-hidden shadow-inner border border-gray-200/50 relative">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${Math.min(progress, 90)}%` }}
            />
            {/* Shimmer effect overlay - only show when progress > 0 */}
            {progress > 0 && (
              <div 
                className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                style={{ 
                  left: `${Math.min(progress, 85)}%`,
                  animation: 'shimmer 1.5s ease-in-out infinite',
                  transform: 'translateX(-50%)',
                }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span className="animate-pulse">Loading</span>
            <span className="font-semibold text-gray-700">{Math.round(Math.min(progress, 90))}%</span>
          </div>
        </div>

        {/* Loading dots animation */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}


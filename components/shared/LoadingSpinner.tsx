import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '../ui/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'minimal' | 'enhanced';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  text, 
  fullScreen = false,
  variant = 'default' 
}: LoadingSpinnerProps) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      {variant === 'enhanced' ? (
        <div className="relative">
          {/* Pulsing background ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          {/* Spinner */}
          <Loader2 className={cn('relative animate-spin text-primary', sizeClasses[size])} />
          {/* Sparkle accent */}
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-primary/60 animate-pulse" />
        </div>
      ) : variant === 'minimal' ? (
        <div className="relative">
          <div className={cn('border-2 border-gray-200 border-t-primary rounded-full animate-spin', sizeClasses[size])} />
        </div>
      ) : (
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      )}
      {text && (
        <p className={cn(
          'text-sm font-medium transition-opacity duration-300',
          variant === 'enhanced' ? 'text-gray-700' : 'text-gray-600'
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}


import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ActionButtonProps {
  icon: LucideIcon;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  className?: string;
}

export function ActionButton({ 
  icon: Icon, 
  children, 
  variant = 'outline',
  onClick,
  className = ''
}: ActionButtonProps) {
  const baseClasses = 'px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium';
  
  const variantClasses = {
    primary: 'text-black hover:opacity-90',
    secondary: 'bg-black text-white hover:bg-gray-900',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  const primaryStyle = variant === 'primary' ? {
    backgroundColor: 'var(--yellow-400)',
  } : {};

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={primaryStyle}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--yellow-500)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--yellow-400)';
        }
      }}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
}

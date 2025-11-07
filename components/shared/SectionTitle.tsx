import { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  icon: LucideIcon;
  className?: string;
}

export function SectionTitle({ title, icon: Icon, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`text-2xl font-bold text-gray-900 flex items-center gap-3 tracking-tight ${className}`}>
      <Icon 
        className="w-6 h-6" 
        style={{ color: 'var(--yellow-600)' }} 
      />
      {title}
    </h2>
  );
}

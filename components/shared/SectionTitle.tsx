import { LucideIcon } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  icon: LucideIcon;
  className?: string;
}

export function SectionTitle({ title, icon: Icon, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 flex items-center gap-2.5 tracking-tight ${className}`}>
      <Icon 
        className="w-5 h-5 flex-shrink-0" 
        style={{ color: 'var(--yellow-600)' }} 
      />
      <span>{title}</span>
    </h2>
  );
}

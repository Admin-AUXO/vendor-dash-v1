import { ReactNode } from 'react';

interface PageHeaderProps {
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ description, actions }: PageHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <p className="text-sm text-gray-600 font-normal leading-relaxed">{description}</p>
      {actions && <div className="flex gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}


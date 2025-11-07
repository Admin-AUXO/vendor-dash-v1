import { ReactNode } from 'react';

interface PageHeaderProps {
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <p className="text-gray-600">{description}</p>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}


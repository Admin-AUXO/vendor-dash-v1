import { Card, CardContent } from '../ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, change, icon: Icon, trend = 'neutral' }: StatCardProps) {
  const changeColorClass = 
    trend === 'up' ? 'text-green-600' : 
    trend === 'down' ? 'text-red-600' : 
    'text-gray-600';

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-3.5">
        <div className="flex items-start gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: 'var(--yellow-50)' }}
          >
            <Icon 
              className="w-5 h-5" 
              style={{ color: 'var(--yellow-600)' }} 
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1 font-medium leading-normal">{title}</p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight leading-tight">{value}</h2>
            <p className={`text-xs leading-normal ${changeColorClass}`}>{change}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

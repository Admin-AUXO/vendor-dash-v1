import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  disabled?: boolean;
}

interface SidebarProps {
  logo?: {
    icon?: React.ReactNode;
    text: string;
    subtitle?: string;
  };
  navItems: NavItem[];
  activeItem?: string;
  onItemClick: (id: string) => void;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Sidebar Navigation Component
 * 
 * Reusable sidebar navigation for switching between dashboard screens
 * 
 * @example
 * <Sidebar
 *   logo={{ text: 'PropertyVendor', subtitle: 'Pro Dashboard' }}
 *   navItems={menuItems}
 *   activeItem={activeTab}
 *   onItemClick={setActiveTab}
 *   footer={<UserProfile />}
 * />
 */
export function Sidebar({
  logo,
  navItems,
  activeItem,
  onItemClick,
  footer,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'w-72 bg-white border-r border-border flex flex-col shadow-sm',
        className
      )}
    >
      {/* Logo/Brand Section */}
      {logo && (
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {logo.icon ? (
              logo.icon
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--gold-400)' }}
              >
                <span className="text-black font-bold text-lg">PV</span>
              </div>
            )}
            <div>
              <h1 className="text-black font-bold text-lg">{logo.text}</h1>
              {logo.subtitle && (
                <p className="text-gray-500 text-xs">{logo.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isDisabled = item.disabled;

            return (
              <li key={item.id}>
                <button
                  onClick={() => !isDisabled && onItemClick(item.id)}
                  disabled={isDisabled}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    isActive
                      ? 'text-black shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                  style={
                    isActive ? { backgroundColor: 'var(--gold-400)' } : undefined
                  }
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0',
                        isActive
                          ? 'bg-black text-white'
                          : 'bg-gray-200 text-gray-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      {footer && (
        <div className="p-4 border-t border-border">{footer}</div>
      )}
    </aside>
  );
}


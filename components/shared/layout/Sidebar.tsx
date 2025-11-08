import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

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
        'w-64 bg-white border-r border-border flex flex-col shadow-sm',
        className
      )}
    >
      {/* Logo/Brand Section */}
      {logo && (
        <div className="p-4 border-b border-border bg-gradient-to-r from-white to-gold-50">
          <div className="flex items-center gap-3">
            {logo.icon ? (
              logo.icon
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ backgroundColor: 'var(--gold-400)' }}
              >
                <span className="text-black font-display font-extrabold text-lg tracking-tight">PV</span>
              </div>
            )}
            <div>
              <h1 className="text-gray-900 font-display font-bold text-lg m-0 leading-tight tracking-tight">{logo.text}</h1>
              {logo.subtitle && (
                <p className="text-gray-600 text-xs m-0 leading-tight mt-0.5 font-medium">{logo.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1.5">
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
                    'w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-lg',
                    'transition-all duration-200 font-medium text-left text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    'nav-item-base nav-item-hover relative',
                    isActive && 'nav-item-active shadow-sm',
                    !isActive && 'text-gray-700',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon className={cn(
                      'w-5 h-5 flex-shrink-0 transition-colors',
                      isActive ? 'text-gray-900' : 'text-gray-600'
                    )} />
                    <span className="truncate font-medium">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'px-2.5 py-0.5 text-xs font-semibold rounded-full flex-shrink-0',
                        'transition-colors duration-200',
                        isActive
                          ? 'bg-gray-900 text-white shadow-sm'
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
        <div className="p-3 border-t border-border">{footer}</div>
      )}
    </aside>
  );
}


import React from 'react';
import { Bell, Settings, ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface TopHeaderProps {
  title?: string;
  notifications?: {
    count?: number;
    onClick?: () => void;
  };
  user?: {
    name: string;
    role?: string;
    avatar?: string;
    initials?: string;
  };
  actions?: React.ReactNode;
  className?: string;
}

/**
 * TopHeader Component
 * 
 * Top header bar with breadcrumbs, search, notifications, and user menu
 * 
 * @example
 * <TopHeader
 *   title="Dashboard"
 *   breadcrumbs={[{ label: 'Pages' }, { label: 'Dashboard' }]}
 *   search={{ placeholder: 'Search...', onChange: handleSearch }}
 *   notifications={{ count: 3, onClick: handleNotifications }}
 *   user={{ name: 'ABC Services', role: 'Contractor', initials: 'AB' }}
 * />
 */
export function TopHeader({
  title,
  notifications,
  user,
  actions,
  className,
}: TopHeaderProps) {
  return (
    <header
      className={cn(
        'bg-white border-b border-border px-6 py-4 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Page Title */}
        {title && (
          <h1 className="text-2xl font-display font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
        )}

        {/* Right Section - Actions, Notifications, Settings, User */}
        <div className="flex items-center gap-3">
          {/* Custom Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}

          {/* Notification Bell */}
          {notifications && (
            <button
              onClick={notifications.onClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications.count !== undefined && notifications.count > 0 && (
                <span 
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--destructive)' }}
                ></span>
              )}
            </button>
          )}

          {/* Settings */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Profile */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-3 border-l border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                  <Avatar className="h-12 w-12">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback
                        className="bg-gold-400 text-black font-semibold text-base"
                      >
                        {user.initials || user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="hidden lg:block text-left min-w-[140px]">
                    <p className="text-sm font-display font-semibold text-gray-900 m-0 leading-tight">
                      {user.name}
                    </p>
                    {user.role && (
                      <p className="text-xs text-gray-600 m-0 leading-tight mt-0.5 font-medium">{user.role}</p>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}


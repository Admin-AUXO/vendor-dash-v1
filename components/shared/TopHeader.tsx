import React from 'react';
import { Search, Bell, Moon, Sun, Settings, ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';
import { Input } from '../ui/input';
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
  breadcrumbs?: Array<{ label: string; href?: string }>;
  search?: {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
  };
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
  darkMode?: boolean;
  onDarkModeToggle?: () => void;
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
  breadcrumbs,
  search,
  notifications,
  user,
  actions,
  className,
  darkMode = false,
  onDarkModeToggle,
}: TopHeaderProps) {
  return (
    <header
      className={cn(
        'bg-white border-b border-border px-6 py-4 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Title & Breadcrumbs */}
        <div className="flex-1 min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>/</span>}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span
                      className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
          {title && (
            <h2 className="text-2xl font-display font-bold text-gray-900">
              {title}
            </h2>
          )}
        </div>

        {/* Right Section - Search, Actions, User */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          {search && (
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder={search.placeholder || 'Search...'}
                value={search.value}
                onChange={(e) => search.onChange?.(e.target.value)}
                className="pl-10 pr-4 w-64"
              />
            </div>
          )}

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
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          )}

          {/* Dark Mode Toggle */}
          {onDarkModeToggle && (
            <button
              onClick={onDarkModeToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-600" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
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
                <button className="flex items-center gap-2 pl-3 border-l border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                  <Avatar className="h-10 w-10">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback
                        className="bg-gold-400 text-black font-semibold"
                      >
                        {user.initials || user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    {user.role && (
                      <p className="text-xs text-gray-500">{user.role}</p>
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


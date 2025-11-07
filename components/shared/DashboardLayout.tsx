import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Sidebar, NavItem, TopHeader, UserProfile } from './index';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  activeScreen: string;
  onScreenChange: (screenId: string) => void;
  logo?: {
    icon?: React.ReactNode;
    text: string;
    subtitle?: string;
  };
  user?: {
    name: string;
    role?: string;
    avatar?: string;
    initials?: string;
    onViewProfile?: () => void;
  };
  header?: {
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
    actions?: React.ReactNode;
  };
  darkMode?: boolean;
  onDarkModeToggle?: () => void;
  className?: string;
}

/**
 * DashboardLayout Component
 * 
 * Complete dashboard layout with sidebar, header, and content area
 * 
 * @example
 * <DashboardLayout
 *   navItems={menuItems}
 *   activeScreen={activeTab}
 *   onScreenChange={setActiveTab}
 *   logo={{ text: 'PropertyVendor', subtitle: 'Pro Dashboard' }}
 *   user={{ name: 'ABC Services', role: 'Premium Contractor' }}
 * >
 *   {children}
 * </DashboardLayout>
 */
export function DashboardLayout({
  children,
  navItems,
  activeScreen,
  onScreenChange,
  logo,
  user,
  header,
  darkMode = false,
  onDarkModeToggle,
  className,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        logo={logo}
        navItems={navItems}
        activeItem={activeScreen}
        onItemClick={onScreenChange}
        footer={
          user && (
            <UserProfile
              name={user.name}
              role={user.role}
              avatar={user.avatar}
              initials={user.initials}
              onViewProfile={user.onViewProfile}
              variant="gradient"
            />
          )
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        {header && (
          <TopHeader
            title={header.title}
            breadcrumbs={header.breadcrumbs}
            search={header.search}
            notifications={header.notifications}
            user={user}
            actions={header.actions}
            darkMode={darkMode}
            onDarkModeToggle={onDarkModeToggle}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}


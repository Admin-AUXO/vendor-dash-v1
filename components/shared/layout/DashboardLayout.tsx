import React from 'react';
import { Sidebar } from './Sidebar';
import type { NavItem } from './Sidebar';
import { TopHeader } from './TopHeader';
import { UserProfile } from './UserProfile';

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
    notifications?: {
      count?: number;
      onClick?: () => void;
    };
    actions?: React.ReactNode;
  };
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
            notifications={header.notifications}
            user={user}
            actions={header.actions}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}


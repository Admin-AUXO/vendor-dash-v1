/**
 * Icon Utilities
 * 
 * This file provides utilities for working with icons from different icon libraries.
 * Currently supports:
 * - lucide-react (default)
 * - react-icons (FontAwesome, Material, etc.)
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { 
  FaBuilding, 
  FaHome, 
  FaFileInvoice, 
  FaDollarSign, 
  FaBriefcase,
  FaTools,
  FaClipboardList,
  FaChartLine,
  FaBell,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaCalendar,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineBriefcase,
} from 'react-icons/hi';
import {
  MdDashboard,
  MdWork,
  MdPayment,
  MdStore,
  MdHelp,
  MdNotifications,
  MdSettings,
} from 'react-icons/md';

// Re-export commonly used lucide icons
export {
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  User,
  Settings,
  LogOut,
  Bell,
  Home,
  Building,
  FileText,
  DollarSign,
  Briefcase,
  Wrench,
  ClipboardList,
  TrendingUp,
} from 'lucide-react';

// React Icons exports
export const ReactIcons = {
  // FontAwesome
  FaBuilding,
  FaHome,
  FaFileInvoice,
  FaDollarSign,
  FaBriefcase,
  FaTools,
  FaClipboardList,
  FaChartLine,
  FaBell,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaCalendar,
  FaUser,
  FaCog,
  FaSignOutAlt,
  
  // Heroicons
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineDocumentText,
  HiOutlineCash,
  HiOutlineBriefcase,
  
  // Material Design
  MdDashboard,
  MdWork,
  MdPayment,
  MdStore,
  MdHelp,
  MdNotifications,
  MdSettings,
};

/**
 * Icon component that can accept either Lucide icons or React Icons
 */
export interface IconProps {
  icon: LucideIcon | React.ComponentType<{ className?: string; size?: number }>;
  className?: string;
  size?: number;
}

export function Icon({ icon: IconComponent, className, size = 20 }: IconProps) {
  return <IconComponent className={className} size={size} />;
}

/**
 * Get icon based on category/type
 */
export function getIconByCategory(category: string): LucideIcon | React.ComponentType<any> {
  const iconMap: Record<string, LucideIcon | React.ComponentType<any>> = {
    // Work Orders
    'work-order': FaClipboardList,
    'maintenance': FaTools,
    'repair': FaTools,
    
    // Properties
    'residential': FaHome,
    'commercial': FaBuilding,
    'property': HiOutlineHome,
    
    // Financial
    'invoice': FaFileInvoice,
    'payment': FaDollarSign,
    'billing': HiOutlineCash,
    
    // Marketplace
    'marketplace': FaBriefcase,
    'project': HiOutlineBriefcase,
    'bid': FaBriefcase,
    
    // General
    'dashboard': MdDashboard,
    'help': MdHelp,
    'settings': FaCog,
    'notifications': FaBell,
  };

  return iconMap[category.toLowerCase()] || FaBuilding;
}


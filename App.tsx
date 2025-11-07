import { useState, lazy, Suspense } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  FileText, 
  CreditCard, 
  Briefcase,
  Headphones,
  Search,
  Bell,
  Moon,
  Sun,
  Settings,
  ChevronDown
} from 'lucide-react';

// TODO: Create new screen components following guidelines in docs/
// Screens will be created in components/ following the new architecture
const Overview = lazy(() => Promise.resolve({ 
  default: () => (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
      <p className="text-gray-600">Screen component will be created following the new guidelines.</p>
      <p className="text-sm text-gray-500">See docs/COMPONENT_GUIDELINES.md and docs/SCREEN_LAYOUTS.md</p>
    </div>
  )
}));
const WorkOrders = lazy(() => Promise.resolve({ 
  default: () => (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Work Orders</h1>
      <p className="text-gray-600">Screen component will be created following the new guidelines.</p>
      <p className="text-sm text-gray-500">See docs/COMPONENT_GUIDELINES.md and docs/SCREEN_LAYOUTS.md</p>
    </div>
  )
}));
const Invoice = lazy(() => Promise.resolve({ 
  default: () => (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
      <p className="text-gray-600">Screen component will be created following the new guidelines.</p>
      <p className="text-sm text-gray-500">See docs/COMPONENT_GUIDELINES.md and docs/SCREEN_LAYOUTS.md</p>
    </div>
  )
}));
const Payments = lazy(() => Promise.resolve({ 
  default: () => (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
      <p className="text-gray-600">Screen component will be created following the new guidelines.</p>
      <p className="text-sm text-gray-500">See docs/COMPONENT_GUIDELINES.md and docs/SCREEN_LAYOUTS.md</p>
    </div>
  )
}));
const Marketplace = lazy(() => Promise.resolve({ 
  default: () => (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
      <p className="text-gray-600">Screen component will be created following the new guidelines.</p>
      <p className="text-sm text-gray-500">See docs/COMPONENT_GUIDELINES.md and docs/SCREEN_LAYOUTS.md</p>
    </div>
  )
}));
const HelpDesk = lazy(() => Promise.resolve({ 
  default: () => (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Help Desk</h1>
      <p className="text-gray-600">Screen component will be created following the new guidelines.</p>
      <p className="text-sm text-gray-500">See docs/COMPONENT_GUIDELINES.md and docs/SCREEN_LAYOUTS.md</p>
    </div>
  )
}));

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);

  const getComponent = (id: string) => {
    switch (id) {
      case 'overview':
        return <Overview />;
      case 'work-orders':
        return <WorkOrders />;
      case 'invoice':
        return <Invoice />;
      case 'payments':
        return <Payments />;
      case 'marketplace':
        return <Marketplace />;
      case 'help-desk':
        return <HelpDesk />;
      default:
        return <Overview />;
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'work-orders',
      label: 'Work Orders',
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      id: 'invoice',
      label: 'Invoice',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      id: 'help-desk',
      label: 'Help Desk',
      icon: <Headphones className="w-5 h-5" />
    }
  ];

  const activeMenuItem = menuItems.find(item => item.id === activeTab);
  const pageTitle = activeMenuItem?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--yellow-400)' }}
            >
              <span className="text-black font-bold text-lg">PV</span>
            </div>
            <div>
              <h1 className="text-black font-bold text-lg">PropertyVendor</h1>
              <p className="text-gray-500 text-xs">Pro Dashboard</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    activeTab === item.id
                      ? 'text-black shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={activeTab === item.id ? { backgroundColor: 'var(--yellow-400)' } : {}}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div 
            className="p-4 rounded-xl"
            style={{ 
              background: 'linear-gradient(to bottom right, var(--yellow-400), var(--yellow-500))' 
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-black font-bold">AB</span>
              </div>
              <div className="flex-1">
                <p className="text-black font-semibold text-sm">ABC Services</p>
                <p className="text-black/70 text-xs">Premium Contractor</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium">
              View Profile
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Pages</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">{pageTitle}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent bg-white text-sm transition-all"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--yellow-400)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px var(--yellow-400)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                />
              </div>
              
              {/* Icons */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-gray-600" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                
                {/* User Profile */}
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--yellow-400)' }}
                  >
                    <span className="text-black font-semibold">AB</span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-900">ABC Services</p>
                    <p className="text-xs text-gray-500">Contractor</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }>
            {activeTab && getComponent(activeTab)}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

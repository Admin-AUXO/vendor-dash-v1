import { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface SlidingTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function SlidingTabs({ tabs, activeTab, onTabChange }: SlidingTabsProps) {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  const tabWidth = 100 / tabs.length;

  return (
    <div className="relative mb-6">
      <div className="relative bg-white rounded-full p-1.5 border border-gray-200 shadow-inner">
        <div 
          className="absolute top-1.5 left-1.5 h-[calc(100%-12px)] bg-gray-100 rounded-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `calc(${tabWidth}% - 6px)`,
            transform: `translateX(calc(${activeIndex} * 100%))`
          }}
        />
        <div className="relative flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 px-4 py-2.5 font-medium text-sm rounded-full transition-colors relative z-10 flex items-center justify-center gap-2"
            >
              <span className={activeTab === tab.id ? 'text-gray-900' : 'text-gray-600'}>
                {tab.label}
              </span>
              {tab.count !== undefined && (
                <span className={`w-5 h-5 rounded-full text-white text-xs flex items-center justify-center ${
                  activeTab === tab.id ? 'bg-blue-600' : 'bg-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


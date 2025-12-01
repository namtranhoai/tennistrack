import { ReactNode } from 'react';

export interface Tab {
    id: string;
    label: string;
    icon: ReactNode;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 min-h-[60px] transition-all touch-manipulation ${isActive
                                    ? 'bg-green-50 border-b-4 border-green-600 text-green-700'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                                }`}
                            aria-label={tab.label}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <div className={`text-2xl mb-1 ${isActive ? 'scale-110' : ''}`}>
                                {tab.icon}
                            </div>
                            <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

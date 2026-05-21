'use client';

interface Tab {
  name: string;
  title: string;
  emoji: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-border bg-background">
      <nav className="flex gap-1 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
              border-b-2 -mb-[1px]
              ${
                activeTab === tab.name
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }
            `}
          >
            <span>{tab.emoji}</span>
            <span>{tab.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

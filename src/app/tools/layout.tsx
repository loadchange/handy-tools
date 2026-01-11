'use client';

import { ReactNode, useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { ChevronRight, Menu, X, Search } from 'lucide-react';
import { allTools } from '@/lib/tools-list';
import { ScrollArea } from '@/components/ui';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui';

export default function ToolsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Determine active category based on pathname
  const activeTool = allTools.find(t => t.href === pathname);
  const activeCategory = activeTool ? activeTool.category : null;

  // State for expanded categories
  // Initialize with the active category if present
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update expanded categories when the active category changes (e.g., navigation)
  useEffect(() => {
    if (activeCategory) {
      setExpandedCategories(prev => {
        if (!prev.includes(activeCategory)) {
          return [...prev, activeCategory];
        }
        return prev;
      });
    }
  }, [activeCategory]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Group tools by category for the sidebar
  const categories = Array.from(new Set(allTools.map(t => t.category)));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:static top-0 left-0 z-50 lg:z-auto h-full w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="p-4 border-b flex items-center justify-between lg:hidden">
             <span className="font-bold text-lg">Menu</span>
             <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
               <X className="h-5 w-5" />
             </Button>
          </div>

          <ScrollArea className="flex-1 py-4">
             <div className="px-4 space-y-6">
                <div className="space-y-1">
                   <Button variant={pathname === '/tools' ? 'secondary' : 'ghost'} className="w-full justify-start" asChild>
                     <Link href="/tools">
                       <Search className="mr-2 h-4 w-4" />
                       All Modules
                     </Link>
                   </Button>
                </div>

                {categories.map(category => {
                  const isExpanded = expandedCategories.includes(category);
                  return (
                    <Collapsible
                      key={category}
                      open={isExpanded}
                      onOpenChange={() => toggleCategory(category)}
                      className="space-y-1"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full mb-2 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
                        <span>{category}</span>
                        <ChevronRight
                          className={cn(
                            "h-3 w-3 transition-transform duration-200",
                            isExpanded ? "transform rotate-90" : ""
                          )}
                        />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="space-y-1 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                        {allTools.filter(t => t.category === category).map(tool => (
                          <Button
                            key={tool.href}
                            variant={pathname === tool.href ? 'secondary' : 'ghost'}
                            className="w-full justify-start text-sm h-8"
                            asChild
                          >
                            <Link href={tool.href}>
                               <span className="truncate">{tool.name}</span>
                            </Link>
                          </Button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
             </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 overflow-auto bg-background/50 relative">
           {/* Background Grid */}
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none -z-10" />

          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

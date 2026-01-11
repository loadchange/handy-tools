'use client';

import { Search, Menu, Sun, Moon, Github } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b flex items-center justify-between px-4 lg:px-6 shadow-sm sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
             <span className="text-primary">HT</span>
          </div>
          <span className="hidden sm:inline-block">HandyTools</span>
        </Link>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Quick access..."
            className="w-64 pl-10 h-9 bg-background/50 border-primary/20 focus:border-primary/50 transition-all"
            onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value.trim();
                    if (q) {
                      router.push(`/tools?q=${encodeURIComponent(q)}`);
                    }
                  }
            }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
           {mounted ? (theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />) : <div className="w-5 h-5" />}
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <a
            href="https://github.com/loadchange/handy-tools"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
          </a>
        </Button>

         <Button variant="default" size="sm" className="hidden sm:flex bg-primary/90 hover:bg-primary shadow-glow text-xs" asChild>
          <Link href="/about">
             System Info
          </Link>
        </Button>
      </div>
    </header>
  );
}

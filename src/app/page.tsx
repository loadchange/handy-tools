'use client';

import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Search, Wrench, Terminal, Cpu, Zap, Globe, Shield, Activity, Github } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useToolStore } from '@/stores/use-tool-store';
import { useEffect, useState } from 'react';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const router = useRouter();
  const addToSearchHistory = useToolStore(s => s.addToSearchHistory);

  const categories = [
    { name: 'Crypto', description: 'Advanced encryption & hashing tools', icon: <Shield className="h-10 w-10 text-primary" /> },
    { name: 'Converter', description: 'Universal format transformation', icon: <Zap className="h-10 w-10 text-primary" /> },
    { name: 'Web', description: 'Frontend & backend utilities', icon: <Globe className="h-10 w-10 text-primary" /> },
    { name: 'Images and Videos', description: 'Media processing suite', icon: <Activity className="h-10 w-10 text-primary" /> },
    { name: 'Development', description: 'Code generators & helpers', icon: <Terminal className="h-10 w-10 text-primary" /> },
    { name: 'Network', description: 'Network analysis & lookup', icon: <Cpu className="h-10 w-10 text-primary" /> },
    { name: 'Math', description: 'Mathematical computations', icon: <span className="text-4xl">🧮</span> },
    { name: 'Measurement', description: 'Unit conversion tools', icon: <span className="text-4xl">📏</span> },
    { name: 'Text', description: 'String manipulation', icon: <span className="text-4xl">📝</span> },
    { name: 'Data', description: 'Data formatting & cleaning', icon: <span className="text-4xl">📊</span> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] animate-pulse-glow delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 blur-md rounded-full group-hover:bg-primary/80 transition-all duration-300" />
              <Wrench className="h-8 w-8 text-primary relative z-10" />
            </div>
            <h2 className="text-2xl font-bold tracking-tighter uppercase">HandyTools</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20" asChild>
              <a href="https://github.com/loadchange/handy-tools" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-primary/20">
              {mounted ? (theme === 'light' ? '🌙' : '☀️') : <span className="w-5 h-5 block opacity-0" />}
            </Button>
          </div>
        </header>

        <section className="text-center mb-24 animate-fade-in">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-primary uppercase border border-primary/30 rounded-full bg-primary/10">
            Next Generation Utilities
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Powerhouse</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
             A futuristic collection of high-performance tools designed for the modern developer. Encrypt, convert, and optimize with precision.
          </p>

          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Initialize search sequence..."
                className="pl-12 pr-4 py-6 text-lg bg-background/80 backdrop-blur-xl border-primary/20 focus:border-primary/50 rounded-lg shadow-2xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value.trim();
                    if (q) {
                      addToSearchHistory(q);
                      router.push(`/tools?q=${encodeURIComponent(q)}`);
                    }
                  }
                }}
              />
            </div>
          </div>
        </section>

        <main>
          <section className="mb-24">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-3xl font-bold tracking-tight border-l-4 border-primary pl-4">Tool Categories</h2>
               <div className="h-px bg-border flex-1 ml-6 opacity-50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const getUrl = (name: string) => {
                  const urlMap: Record<string, string> = {
                    'Images and Videos': 'images-videos',
                  };
                  return urlMap[name] || name.toLowerCase().replace(/\s+/g, '-');
                };

                return (
                  <Link key={category.name} href={`/tools/${getUrl(category.name)}`} className="block h-full">
                    <Card className="h-full bg-card/40 backdrop-blur-sm border-white/5 hover:bg-card/60 group animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CardHeader className="text-center pb-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Cpu className="w-16 h-16" />
                        </div>
                        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">
                            {category.icon}
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <CardDescription className="text-sm">{category.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="text-center py-16 relative">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />
            <h2 className="text-3xl font-bold mb-6">Ready to Deploy?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Access the full suite of utilities designed to accelerate your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-glow hover:shadow-neon transition-all duration-300" asChild>
                <Link href="/tools">
                  Browse All Tools
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-primary/30 hover:bg-primary/10" asChild>
                <Link href="/about">
                  System Info
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <footer className="text-center mt-20 py-10 border-t border-white/10 text-sm text-muted-foreground space-y-2">
          <p>
            © 2024 HandyTools. <span className="text-primary">Open Source Intelligence.</span>
          </p>
          <p>
            <a href="https://github.com/loadchange/handy-tools" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
            <span className="mx-2">·</span>
            <span>MIT License</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

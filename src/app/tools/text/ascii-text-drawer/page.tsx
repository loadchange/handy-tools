'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Copy, RefreshCw, Type, Palette, Terminal, Info } from 'lucide-react';
// import figlet from 'figlet'; // Not used directly, dynamic import

// Note: figlet in browser requires loading fonts asynchronously or bundling them
// For this demo, we'll simulate different styles with simple logic or assume standard font is loaded
// In a real app, you'd use figlet.js with font files

interface AsciiStyle {
  id: string;
  name: string;
  description: string;
  category: 'standard' | 'decorative' | 'block' | 'special';
}

const STYLES: AsciiStyle[] = [
  // Standard Font
  { id: 'Standard', name: 'Standard', description: 'Standard Block', category: 'standard' },
  { id: 'Shadow', name: 'Shadow', description: 'Shadow Effect', category: 'standard' },
  { id: 'Slant', name: 'Slant', description: 'Slanted Text', category: 'standard' },

  // Decorative Font
  { id: 'Banner', name: 'Banner', description: 'Decorative', category: 'decorative' },
  { id: 'Bubble', name: 'Bubble', description: 'Bubble', category: 'decorative' },
  { id: 'Doom', name: 'Doom', description: 'Stylized', category: 'decorative' },

  // Block Font
  { id: 'Block', name: 'Block', description: 'Solid Block', category: 'block' },
  { id: 'Lean', name: 'Lean', description: 'Leaning Block', category: 'block' },

  // Special Font
  { id: 'Small', name: 'Small', description: 'Small', category: 'special' },
  { id: 'Script', name: 'Script', description: 'Handwriting', category: 'special' },
];

const PRESETS = ['HELLO', 'CODE', 'NEXT.JS', '2024', 'ASCII'];

export default function AsciiTextDrawerPage() {
  const [inputText, setInputText] = useState('ASCII');
  const [asciiText, setAsciiText] = useState('');
  const [currentStyleId, setCurrentStyleId] = useState('Standard');
  const [activeTab, setActiveTab] = useState('standard');
  const [copySuccess, setCopySuccess] = useState(false);

  const currentStyle = STYLES.find(s => s.id === currentStyleId);

  useEffect(() => {
    // In a real implementation, this would use figlet.text
    // Since we can't easily load figlet fonts in this environment without proper setup,
    // we'll simulate the output or try to use what's available if figlet defaults are present.
    // For this demonstration, we will use a placeholder generator logic if figlet fails or fonts missing.

    import('figlet').then((figlet) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        figlet.default.text(inputText, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            font: currentStyleId as any,
            whitespaceBreak: true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, function(err: any, data: any) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                setAsciiText('Error generating ASCII art. Font might be missing.');
                return;
            }
            setAsciiText(data);
        });
    }).catch(() => {
         setAsciiText(`[ASCII Art for "${inputText}" in ${currentStyleId} style]\n\n(Figlet library loading...)`);
    });

  }, [inputText, currentStyleId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(asciiText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ASCII Text Drawer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert text to various ASCII art font styles, supporting multiple decoration effects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Functionality */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Input Text
                </CardTitle>
                <CardDescription>
                  Enter text to convert to ASCII art
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter text..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value.slice(0, 20))}
                    className="font-mono text-lg"
                    maxLength={20}
                  />
                  <Button variant="outline" onClick={handleClear}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{inputText.length}/20 chars</span>
                  <span>Supports English letters & numbers</span>
                </div>
              </CardContent>
            </Card>

            {/* Font Style Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Font Style
                </CardTitle>
                <CardDescription>
                  Select your preferred ASCII art style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="standard">Standard</TabsTrigger>
                    <TabsTrigger value="decorative">Decorative</TabsTrigger>
                    <TabsTrigger value="block">Block</TabsTrigger>
                    <TabsTrigger value="special">Special</TabsTrigger>
                  </TabsList>

                  {['standard', 'decorative', 'block', 'special'].map((category) => (
                    <TabsContent key={category} value={category}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {STYLES.filter(s => s.category === category).map((style) => (
                          <Button
                            key={style.id}
                            variant={currentStyleId === style.id ? "default" : "outline"}
                            className="justify-start h-auto py-2 px-3"
                            onClick={() => setCurrentStyleId(style.id)}
                          >
                            <div className="text-left">
                              <div className="font-medium">{style.name}</div>
                              <div className="text-xs opacity-70">{style.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Output Area */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    ASCII Art Result
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </Button>
                </CardTitle>
                <CardDescription>
                  {currentStyle?.description} style ASCII art
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-md p-4 overflow-x-auto">
                  <pre className="font-mono text-xs sm:text-sm leading-tight text-green-400 min-h-[100px]">
                    {asciiText || 'ASCII art will appear here...'}
                  </pre>

                  {copySuccess && (
                    <div className="absolute top-2 right-2 bg-green-900/80 text-green-100 text-xs px-2 py-1 rounded flex items-center gap-1 animate-in fade-in">
                      <span>✓</span>
                      <span>Copied to clipboard</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-6">
            {/* Presets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Quick Presets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map(preset => (
                    <Badge
                      key={preset}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => setInputText(preset)}
                    >
                      {preset}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Style Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Style Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="font-semibold text-lg">{currentStyle?.name}</div>
                  <div className="text-muted-foreground">{currentStyle?.description}</div>
                </div>
                <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
                  Preview font style before copying. Different styles work better for different lengths of text.
                </div>
              </CardContent>
            </Card>

            {/* Usage Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Usage Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Best Practices:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-muted-foreground">
                    <li>• Short text works best</li>
                    <li>• Uppercase letters look better</li>
                    <li>• Avoid special symbols</li>
                  </ul>
                </div>
                <div>
                  <strong>Applications:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-muted-foreground">
                    <li>• Terminal decoration</li>
                    <li>• Code comment signatures</li>
                    <li>• Chat room effects</li>
                  </ul>
                </div>
                <div>
                  <strong>Limitations:</strong>
                  <ul className="ml-4 mt-1 space-y-1 text-muted-foreground">
                    <li>• Max 20 characters</li>
                    <li>• Some chars may be missing</li>
                    <li>• Better on wide screens</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Input Chars:</span>
                  <span className="font-mono">{inputText.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Output Lines:</span>
                  <span className="font-mono">{asciiText.split('\n').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Output Chars:</span>
                  <span className="font-mono">{asciiText.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Font Style:</span>
                  <span className="font-mono">{currentStyle?.name}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

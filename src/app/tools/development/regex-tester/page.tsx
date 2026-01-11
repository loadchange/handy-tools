'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Label } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Search,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  Code,
  BookOpen,
  Zap,
  AlertCircle
} from 'lucide-react';

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
  start: number;
  end: number;
}

interface RegexTestResult {
  isValid: boolean;
  matches: RegexMatch[];
  error?: string;
  flags: string;
}

const COMMON_REGEX_PATTERNS = [
  {
    name: 'Email Address',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: 'Matches valid email address format'
  },
  {
    name: 'Phone Number (China)',
    pattern: '^1[3-9]\\d{9}$',
    description: 'Matches Mainland China phone numbers'
  },
  {
    name: 'URL',
    pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
    description: 'Matches HTTP/HTTPS URL'
  },
  {
    name: 'IP Address',
    pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    description: 'Matches IPv4 address'
  },
  {
    name: 'Password Strength',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
    description: 'At least 8 chars, containing uppercase, lowercase, and digit'
  },
  {
    name: 'ID Card (China)',
    pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$',
    description: 'Matches 18-digit Chinese ID card number'
  }
];

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [flags, setFlags] = useState('g');
  const [isGlobal, setIsGlobal] = useState(true);
  const [isIgnoreCase, setIsIgnoreCase] = useState(false);
  const [isMultiline, setIsMultiline] = useState(false);
  const [result, setResult] = useState<RegexTestResult | null>(null);
  const [highlightedText, setHighlightedText] = useState('');

  useEffect(() => {
    let newFlags = '';
    if (isGlobal) newFlags += 'g';
    if (isIgnoreCase) newFlags += 'i';
    if (isMultiline) newFlags += 'm';
    setFlags(newFlags);
  }, [isGlobal, isIgnoreCase, isMultiline]);

  const testRegex = useCallback(() => {
    if (!pattern) {
      setResult({
        isValid: false,
        matches: [],
        error: 'Please enter a regular expression',
        flags: ''
      });
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches: RegexMatch[] = [];

      if (isGlobal) {
        let match;
        while ((match = regex.exec(testText)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            start: match.index,
            end: match.index + match[0].length
          });
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            start: match.index,
            end: match.index + match[0].length
          });
        }
      }

      setResult({
        isValid: true,
        matches,
        flags
      });

      // Generate highlight text
      if (matches.length > 0) {
        let highlighted = testText;
        matches.reverse().forEach(match => {
          highlighted =
            highlighted.slice(0, match.start) +
            `<mark class="bg-yellow-200 px-1 rounded">${match.match}</mark>` +
            highlighted.slice(match.end);
        });
        setHighlightedText(highlighted);
      } else {
        setHighlightedText(testText);
      }
    } catch (error) {
      setResult({
        isValid: false,
        matches: [],
        error: error instanceof Error ? error.message : 'Regex syntax error',
        flags: ''
      });
      setHighlightedText(testText);
    }
  }, [pattern, flags, testText, isGlobal]);

  useEffect(() => {
    if (pattern && testText) {
      testRegex();
    }
  }, [pattern, testText, flags, testRegex]);

  const loadExample = (examplePattern: typeof COMMON_REGEX_PATTERNS[0]) => {
    setPattern(examplePattern.pattern);
    setTestText('Please enter test text here...');
  };

  const clearAll = () => {
    setPattern('');
    setTestText('');
    setResult(null);
    setHighlightedText('');
  };

  const generateTestText = () => {
    const samples = [
      'email@example.com',
      'test.user+tag@domain.org',
      '1234567890',
      'https://www.example.com/path?query=value',
      '192.168.1.1',
      'Password123!',
      '440101199001011234'
    ];
    setTestText(samples.join('\n'));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Regex Tester</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test and debug regular expressions, see real-time matches, support flags and common patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Input Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Regex Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Regular Expression
                </CardTitle>
                <CardDescription>
                  Enter the regex to test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter regex, e.g.: ^[a-zA-Z]+$"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="font-mono"
                />

                {/* Flags */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="global"
                      checked={isGlobal}
                      onCheckedChange={setIsGlobal}
                    />
                    <Label htmlFor="global" className="text-sm cursor-pointer">
                      Global (g)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ignoreCase"
                      checked={isIgnoreCase}
                      onCheckedChange={setIsIgnoreCase}
                    />
                    <Label htmlFor="ignoreCase" className="text-sm cursor-pointer">
                      Ignore Case (i)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="multiline"
                      checked={isMultiline}
                      onCheckedChange={setIsMultiline}
                    />
                    <Label htmlFor="multiline" className="text-sm cursor-pointer">
                      Multiline (m)
                    </Label>
                  </div>
                </div>

                {/* Current Flags */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Flags:</span>
                  <Badge variant="outline">/{pattern}/{flags}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Test Text Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Test String
                </CardTitle>
                <CardDescription>
                  Enter text to match against
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter test text..."
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={generateTestText} className="flex-1">
                    Generate Sample Text
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Match Result */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    Match Result
                  </CardTitle>
                  <CardDescription>
                    {result.isValid
                      ? `Found ${result.matches.length} matches`
                      : 'Invalid Regex'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!result.isValid && result.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Syntax Error</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">{result.error}</p>
                    </div>
                  )}

                  {result.isValid && result.matches.length > 0 && (
                    <div className="space-y-3">
                      {result.matches.map((match, index) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800">
                              Match #{index + 1}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              Position: {match.index}-{match.end}
                            </Badge>
                          </div>
                          <div className="font-mono text-sm bg-white p-2 rounded border">
                            {match.match}
                          </div>
                          {match.groups.length > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <span className="font-medium">Groups:</span>
                              <div className="mt-1 space-y-1">
                                {match.groups.map((group, groupIndex) => (
                                  <div key={groupIndex} className="bg-muted p-1 rounded">
                                    Group {groupIndex + 1}: {group || '(empty)'}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {result.isValid && result.matches.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-2" />
                      <p>No matches found</p>
                    </div>
                  )}

                  {/* Highlight */}
                  {result.isValid && testText && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Highlight Matches</Label>
                      <div
                        className="mt-2 p-3 bg-muted rounded-md font-mono text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Common Patterns and Reference */}
          <div className="space-y-6">
            {/* Common Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Common Patterns
                </CardTitle>
                <CardDescription>
                  Click to use preset regular expressions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {COMMON_REGEX_PATTERNS.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => loadExample(item)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{item.name}</span>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground mb-1">
                      {item.pattern}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Quick Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-3 mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">.</code>
                        <span>Any character</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">\\d</code>
                        <span>Digit [0-9]</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">\\w</code>
                        <span>Word char [a-zA-Z0-9_]</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">\\s</code>
                        <span>Whitespace</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">^</code>
                        <span>Start of string</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">$</code>
                        <span>End of string</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-3 mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">*</code>
                        <span>Zero or more</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">+</code>
                        <span>One or more</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">?</code>
                        <span>Zero or one</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">{'{n}'}</code>
                        <span>Exactly n times</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">[abc]</code>
                        <span>Character set</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">(abc)</code>
                        <span>Capture group</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

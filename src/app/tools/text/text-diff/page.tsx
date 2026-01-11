'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  GitCompare,
  FileText,
  Plus,
  Minus,
  RefreshCw,
  Settings,
  Info
} from 'lucide-react';

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed' | 'context';
  content: string;
  lineNumber?: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface DiffResult {
  lines: DiffLine[];
  additions: number;
  deletions: number;
  changes: number;
  unchanged: number;
}

const SAMPLE_TEXTS = [
  {
    name: 'Code Example',
    original: `function hello() {
  console.log("Hello, World!");
  return "Hello";
}`,
    modified: `function hello() {
  console.log("Hello, World!");
  console.log("This is a new line");
  return "Hello";
}`
  },
  {
    name: 'Text Example',
    original: `This is a sample text.
Used to demonstrate text diff functionality.`,
    modified: `This is a sample text.
Used to demonstrate text diff functionality.
This is a newly added sentence.`
  },
  {
    name: 'JSON Example',
    original: `{
  "name": "John Doe",
  "age": 25
}`,
    modified: `{
  "name": "John Doe",
  "age": 26,
  "city": "New York"
}`
  }
];

export default function TextDiffPage() {
  const [leftText, setLeftText] = useState<string>('');
  const [rightText, setRightText] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);

  const normalizeText = (text: string): string[] => {
    let normalized = text;

    if (ignoreWhitespace) {
      normalized = normalized.replace(/\s+/g, ' ').trim();
    }

    if (ignoreCase) {
      normalized = normalized.toLowerCase();
    }

    return normalized.split('\n');
  };

  const computeDiff = (originalLines: string[], modifiedLines: string[]): DiffResult => {
    const lines: DiffLine[] = [];
    let additions = 0;
    let deletions = 0;
    let unchanged = 0;

    const maxLines = Math.max(originalLines.length, modifiedLines.length);

    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i];
      const modifiedLine = modifiedLines[i];

      if (originalLine === undefined) {
        lines.push({
          type: 'added',
          content: modifiedLine,
          newLineNumber: i + 1
        });
        additions++;
      } else if (modifiedLine === undefined) {
        lines.push({
          type: 'removed',
          content: originalLine,
          oldLineNumber: i + 1
        });
        deletions++;
      } else if (originalLine === modifiedLine) {
        lines.push({
          type: 'unchanged',
          content: originalLine,
          oldLineNumber: i + 1,
          newLineNumber: i + 1
        });
        unchanged++;
      } else {
        lines.push({
          type: 'removed',
          content: originalLine,
          oldLineNumber: i + 1
        });
        lines.push({
          type: 'added',
          content: modifiedLine,
          newLineNumber: i + 1
        });
        deletions++;
        additions++;
      }
    }

    return {
      lines,
      additions,
      deletions,
      changes: additions + deletions,
      unchanged
    };
  };

  const performDiff = useCallback(() => {
    const originalLines = normalizeText(leftText);
    const modifiedLines = normalizeText(rightText);

    const result = computeDiff(originalLines, modifiedLines);
    setDiffResult(result);
  }, [leftText, rightText, ignoreWhitespace, ignoreCase]);

  const loadSample = (sample: typeof SAMPLE_TEXTS[0]) => {
    setLeftText(sample.original);
    setRightText(sample.modified);
  };

  const clearAll = () => {
    setLeftText('');
    setRightText('');
    setDiffResult(null);
  };

  const getDiffStats = () => {
    if (!diffResult) return null;

    const total = diffResult.additions + diffResult.deletions + diffResult.unchanged;
    const changePercentage = total > 0 ? Math.round((diffResult.changes / total) * 100) : 0;

    return {
      total,
      changePercentage,
      additionsPercentage: total > 0 ? Math.round((diffResult.additions / total) * 100) : 0,
      deletionsPercentage: total > 0 ? Math.round((diffResult.deletions / total) * 100) : 0
    };
  };

  const renderSideBySideDiff = () => {
    if (!diffResult) return null;

    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Original Text */}
        <div>
          <div className="text-sm font-medium mb-2">Original Text</div>
          <div className="border rounded-lg overflow-hidden">
            {diffResult.lines.map((line, index) => (
              <div
                key={index}
                className={`flex border-b last:border-b-0 ${
                  line.type === 'removed' ? 'bg-red-50' :
                  line.type === 'added' ? 'bg-green-50' :
                  line.type === 'context' ? 'bg-blue-50' : ''
                }`}
              >
                {showLineNumbers && line.oldLineNumber && (
                  <div className="w-12 p-2 text-xs text-muted-foreground text-right border-r">
                    {line.oldLineNumber}
                  </div>
                )}
                <div className={`flex-1 p-2 font-mono text-sm ${
                  line.type === 'removed' ? 'text-red-800' :
                  line.type === 'added' ? 'text-green-800' :
                  line.type === 'context' ? 'text-blue-800' : ''
                }`}>
                  {line.type === 'removed' && <Minus className="inline w-3 h-3 mr-2" />}
                  {line.type === 'added' && <Plus className="inline w-3 h-3 mr-2" />}
                  {line.content || ' '}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Modified Text */}
        <div>
          <div className="text-sm font-medium mb-2">Modified Text</div>
          <div className="border rounded-lg overflow-hidden">
            {diffResult.lines.map((line, index) => (
              <div
                key={index}
                className={`flex border-b last:border-b-0 ${
                  line.type === 'added' ? 'bg-green-50' :
                  line.type === 'removed' ? 'bg-red-50' :
                  line.type === 'context' ? 'bg-blue-50' : ''
                }`}
              >
                {showLineNumbers && line.newLineNumber && (
                  <div className="w-12 p-2 text-xs text-muted-foreground text-right border-r">
                    {line.newLineNumber}
                  </div>
                )}
                <div className={`flex-1 p-2 font-mono text-sm ${
                  line.type === 'added' ? 'text-green-800' :
                  line.type === 'removed' ? 'text-red-800' :
                  line.type === 'context' ? 'text-blue-800' : ''
                }`}>
                  {line.type === 'added' && <Plus className="inline w-3 h-3 mr-2" />}
                  {line.type === 'removed' && <Minus className="inline w-3 h-3 mr-2" />}
                  {line.content || ' '}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderUnifiedDiff = () => {
    if (!diffResult) return null;

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 bg-muted text-xs text-muted-foreground p-2">
          {showLineNumbers && <div className="text-center">Line</div>}
          {showLineNumbers && <div className="text-center">Line</div>}
          <div>Content</div>
        </div>
        {diffResult.lines.map((line, index) => (
          <div
            key={index}
            className={`grid grid-cols-3 border-b last:border-b-0 ${
              line.type === 'added' ? 'bg-green-50' :
              line.type === 'removed' ? 'bg-red-50' :
              line.type === 'context' ? 'bg-blue-50' : ''
            }`}
          >
            {showLineNumbers && (
              <div className="p-2 text-xs text-muted-foreground text-right border-r">
                {line.oldLineNumber || ''}
              </div>
            )}
            {showLineNumbers && (
              <div className="p-2 text-xs text-muted-foreground text-right border-r">
                {line.newLineNumber || ''}
              </div>
            )}
            <div className={`p-2 font-mono text-sm ${
              line.type === 'added' ? 'text-green-800' :
              line.type === 'removed' ? 'text-red-800' :
              line.type === 'context' ? 'text-blue-800' : ''
            }`}>
              {line.type === 'added' && <Plus className="inline w-3 h-3 mr-2" />}
              {line.type === 'removed' && <Minus className="inline w-3 h-3 mr-2" />}
              {line.type === 'context' && <span className="inline w-3 h-3 mr-2">@@</span>}
              {line.content || ' '}
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (leftText || rightText) {
      performDiff();
    }
  }, [performDiff]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Text Diff Tool</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare two texts and visualize additions, deletions, and changes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Input Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Text Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Text Input
                </CardTitle>
                <CardDescription>
                  Enter original and modified text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Original Text</Label>
                    <Textarea
                      value={leftText}
                      onChange={(e) => setLeftText(e.target.value)}
                      placeholder="Enter original text..."
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Modified Text</Label>
                    <Textarea
                      value={rightText}
                      onChange={(e) => setRightText(e.target.value)}
                      placeholder="Enter modified text..."
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Samples */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Samples</Label>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_TEXTS.map((sample, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadSample(sample)}
                      >
                        {sample.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={performDiff} className="flex-1">
                    <GitCompare className="h-4 w-4 mr-2" />
                    Compare Diff
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Diff Result */}
            {diffResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitCompare className="h-5 w-5" />
                      Diff Result
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-green-700 bg-green-50">
                        +{diffResult.additions} Added
                      </Badge>
                      <Badge variant="destructive" className="text-red-700 bg-red-50">
                        -{diffResult.deletions} Removed
                      </Badge>
                      <Badge variant="secondary" className="text-blue-700 bg-blue-50">
                        {diffResult.unchanged} Unchanged
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {getDiffStats() && (
                      <div className="flex gap-4 text-sm">
                        <span>Total Lines: {getDiffStats()!.total}</span>
                        <span>•</span>
                        <span>Change Rate: {getDiffStats()!.changePercentage}%</span>
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'side-by-side' | 'unified')} className="w-full">
                    <TabsList>
                      <TabsTrigger value="side-by-side">Side-by-Side</TabsTrigger>
                      <TabsTrigger value="unified">Unified</TabsTrigger>
                    </TabsList>

                    <TabsContent value="side-by-side" className="mt-4">
                      {renderSideBySideDiff()}
                    </TabsContent>

                    <TabsContent value="unified" className="mt-4">
                      {renderUnifiedDiff()}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Config and Stats */}
          <div className="space-y-6">
            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Ignore Whitespace</Label>
                  <Switch
                    checked={ignoreWhitespace}
                    onCheckedChange={setIgnoreWhitespace}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Ignore Case</Label>
                  <Switch
                    checked={ignoreCase}
                    onCheckedChange={setIgnoreCase}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Show Line Numbers</Label>
                  <Switch
                    checked={showLineNumbers}
                    onCheckedChange={setShowLineNumbers}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {diffResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Lines:</span>
                    <span className="font-semibold">{diffResult.lines.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additions:</span>
                    <span className="font-semibold text-green-600">+{diffResult.additions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deletions:</span>
                    <span className="font-semibold text-red-600">-{diffResult.deletions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unchanged:</span>
                    <span className="font-semibold text-blue-600">{diffResult.unchanged}</span>
                  </div>
                  {getDiffStats() && (
                    <>
                      <div className="flex justify-between">
                        <span>Change Rate:</span>
                        <span className="font-semibold">{getDiffStats()!.changePercentage}%</span>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Added</span>
                            <span>{getDiffStats()!.additionsPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${getDiffStats()!.additionsPercentage}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Removed</span>
                            <span>{getDiffStats()!.deletionsPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${getDiffStats()!.deletionsPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Usage Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Usage Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Diff Modes:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>Side-by-Side:</strong> View original and modified text side by side</li>
                    <li>• <strong>Unified:</strong> View changes in a single combined view (like Git diff)</li>
                  </ul>
                </div>
                <div>
                  <strong>Color Legend:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <span className="text-green-600">Green</span>: Added content</li>
                    <li>• <span className="text-red-600">Red</span>: Removed content</li>
                    <li>• <span className="text-blue-600">Blue</span>: Context</li>
                  </ul>
                </div>
                <div>
                  <strong>Shortcuts:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Click samples to load quickly</li>
                    <li>• Options apply in real-time</li>
                    <li>• Supports large text comparison</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

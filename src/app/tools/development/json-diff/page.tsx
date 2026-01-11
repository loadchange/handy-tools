'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Label } from '@/components/ui';
import {
  FileJson,
  GitCompare,
  Copy,
  RefreshCw,
  Plus,
  Minus,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface DiffResult {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  path: string;
  oldValue?: unknown;
  newValue?: unknown;
  oldIndex?: number;
  newIndex?: number;
}

interface JsonDiffOptions {
  showUnchanged: boolean;
  caseSensitive: boolean;
  ignoreWhitespace: boolean;
  showLineNumbers: boolean;
}

const SAMPLE_JSON_1 = {
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "skills": ["JavaScript", "React", "Node.js"],
  "profile": {
    "email": "johndoe@example.com",
    "phone": "13800138000"
  },
  "active": true
};

const SAMPLE_JSON_2 = {
  "name": "John Doe",
  "age": 32,
  "city": "San Francisco",
  "skills": ["JavaScript", "React", "Vue", "Node.js"],
  "profile": {
    "email": "johndoe@example.com",
    "phone": "13900139000",
    "address": "123 Main St"
  },
  "active": true,
  "department": "Engineering"
};

export default function JsonDiffPage() {
  const [leftJson, setLeftJson] = useState(JSON.stringify(SAMPLE_JSON_1, null, 2));
  const [rightJson, setRightJson] = useState(JSON.stringify(SAMPLE_JSON_2, null, 2));
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [options, setOptions] = useState<JsonDiffOptions>({
    showUnchanged: false,
    caseSensitive: true,
    ignoreWhitespace: true,
    showLineNumbers: true
  });
  const [isDiffValid, setIsDiffValid] = useState(true);
  const [activeTab, setActiveTab] = useState('visual');

  const parseJson = (jsonString: string): unknown => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  const compareArrays = useCallback((arr1: unknown[], arr2: unknown[], path = ''): DiffResult[] => {
    const diffs: DiffResult[] = [];
    const maxLength = Math.max(arr1.length, arr2.length);

    for (let i = 0; i < maxLength; i++) {
      const currentPath = `${path}[${i}]`;

      if (i >= arr1.length) {
        diffs.push({
          type: 'added',
          path: currentPath,
          newIndex: i,
          newValue: arr2[i]
        });
      } else if (i >= arr2.length) {
        diffs.push({
          type: 'removed',
          path: currentPath,
          oldIndex: i,
          oldValue: arr1[i]
        });
      } else if (arr1[i] !== arr2[i]) {
        diffs.push({
          type: 'modified',
          path: currentPath,
          oldIndex: i,
          newIndex: i,
          oldValue: arr1[i],
          newValue: arr2[i]
        });
      } else if (options.showUnchanged) {
        diffs.push({
          type: 'unchanged',
          path: currentPath,
          oldIndex: i,
          newIndex: i,
          oldValue: arr1[i],
          newValue: arr2[i]
        });
      }
    }

    return diffs;
  }, [options.showUnchanged]);

  const compareObjects = useCallback((obj1: unknown, obj2: unknown, path = ''): DiffResult[] => {
    const diffs: DiffResult[] = [];

    if (obj1 === null && obj2 === null) return diffs;
    if (obj1 === null) {
      diffs.push({
        type: 'added',
        path: path || 'root',
        newValue: obj2
      });
      return diffs;
    }
    if (obj2 === null) {
      diffs.push({
        type: 'removed',
        path: path || 'root',
        oldValue: obj1
      });
      return diffs;
    }

    // Ensure obj1 and obj2 are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      // Simple value comparison
      if (obj1 !== obj2) {
        diffs.push({
          type: 'modified',
          path: path || 'root',
          oldValue: obj1,
          newValue: obj2
        });
      } else if (options.showUnchanged) {
        diffs.push({
          type: 'unchanged',
          path: path || 'root',
          oldValue: obj1,
          newValue: obj2
        });
      }
      return diffs;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const allKeys = new Set([...keys1, ...keys2]);

    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      const value1 = (obj1 as Record<string, unknown>)[key];
      const value2 = (obj2 as Record<string, unknown>)[key];

      if (!(key in obj1)) {
        diffs.push({
          type: 'added',
          path: currentPath,
          newValue: value2
        });
      } else if (!(key in obj2)) {
        diffs.push({
          type: 'removed',
          path: currentPath,
          oldValue: value1
        });
      } else if (typeof value1 !== typeof value2) {
        diffs.push({
          type: 'modified',
          path: currentPath,
          oldValue: value1,
          newValue: value2
        });
      } else if (Array.isArray(value1) && Array.isArray(value2)) {
        const arrayDiffs = compareArrays(value1, value2, currentPath);
        diffs.push(...arrayDiffs);
      } else if (typeof value1 === 'object' && typeof value2 === 'object' && value1 !== null && value2 !== null) {
        const objectDiffs = compareObjects(value1, value2, currentPath);
        diffs.push(...objectDiffs);
      } else if (value1 !== value2) {
        diffs.push({
          type: 'modified',
          path: currentPath,
          oldValue: value1,
          newValue: value2
        });
      } else if (options.showUnchanged) {
        diffs.push({
          type: 'unchanged',
          path: currentPath,
          oldValue: value1,
          newValue: value2
        });
      }
    }

    return diffs;
  }, [compareArrays, options.showUnchanged]);

  const performDiff = useCallback(() => {
    const leftParsed = parseJson(leftJson);
    const rightParsed = parseJson(rightJson);

    if (!leftParsed || !rightParsed) {
      setIsDiffValid(false);
      setDiffResult([]);
      return;
    }

    setIsDiffValid(true);

    if (typeof leftParsed === 'object' && typeof rightParsed === 'object') {
      const diffs = compareObjects(leftParsed, rightParsed);
      setDiffResult(diffs);
    } else {
      // Simple value comparison
      if (leftParsed !== rightParsed) {
        setDiffResult([{
          type: 'modified',
          path: 'root',
          oldValue: leftParsed,
          newValue: rightParsed
        }]);
      } else {
        setDiffResult([{
          type: 'unchanged',
          path: 'root',
          oldValue: leftParsed,
          newValue: rightParsed
        }]);
      }
    }
  }, [leftJson, rightJson, compareObjects]);

  useEffect(() => {
    performDiff();
  }, [performDiff]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const loadSampleData = () => {
    setLeftJson(JSON.stringify(SAMPLE_JSON_1, null, 2));
    setRightJson(JSON.stringify(SAMPLE_JSON_2, null, 2));
  };

  const clearAll = () => {
    setLeftJson('{}');
    setRightJson('{}');
    setDiffResult([]);
  };

  const formatJson = (jsonString: string, side: 'left' | 'right') => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      if (side === 'left') {
        setLeftJson(formatted);
      } else {
        setRightJson(formatted);
      }
    } catch {
      // Invalid JSON, do nothing
    }
  };

  const getDiffIcon = (type: DiffResult['type']) => {
    switch (type) {
      case 'added':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'removed':
        return <Minus className="h-4 w-4 text-red-600" />;
      case 'modified':
        return <ChevronRight className="h-4 w-4 text-orange-600" />;
      default:
        return <ChevronRight className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDiffColor = (type: DiffResult['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'removed':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'modified':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  const getDiffBadgeVariant = (type: DiffResult['type']) => {
    switch (type) {
      case 'added':
        return 'default' as const;
      case 'removed':
        return 'destructive' as const;
      case 'modified':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const renderVisualDiff = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <Badge variant="outline" className="text-green-700 bg-green-50">
          Added {diffResult.filter(d => d.type === 'added').length}
        </Badge>
        <Badge variant="destructive" className="text-red-700 bg-red-50">
          Removed {diffResult.filter(d => d.type === 'removed').length}
        </Badge>
        <Badge variant="secondary" className="text-orange-700 bg-orange-50">
          Modified {diffResult.filter(d => d.type === 'modified').length}
        </Badge>
        {options.showUnchanged && (
          <Badge variant="outline" className="text-gray-700 bg-gray-50">
            Unchanged {diffResult.filter(d => d.type === 'unchanged').length}
          </Badge>
        )}
      </div>

      {diffResult.length === 0 && isDiffValid && (
        <div className="text-center py-8 text-muted-foreground">
          <GitCompare className="h-12 w-12 mx-auto mb-2" />
          <p>Two JSON objects are identical</p>
        </div>
      )}

      {diffResult.map((diff, index) => (
        <div
          key={index}
          className={`p-4 border rounded-lg ${getDiffColor(diff.type)}`}
        >
          <div className="flex items-start gap-3">
            {getDiffIcon(diff.type)}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={getDiffBadgeVariant(diff.type)}>
                  {diff.type === 'added' && 'Added'}
                  {diff.type === 'removed' && 'Removed'}
                  {diff.type === 'modified' && 'Modified'}
                  {diff.type === 'unchanged' && 'Unchanged'}
                </Badge>
                <code className="text-sm font-mono">{diff.path}</code>
              </div>

              {diff.oldValue !== undefined && (
                <div>
                  <Label className="text-xs font-medium">Old Value</Label>
                  <div className="mt-1 p-2 bg-white/50 rounded border">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {typeof diff.oldValue === 'object'
                        ? JSON.stringify(diff.oldValue, null, 2)
                        : String(diff.oldValue)}
                    </pre>
                  </div>
                </div>
              )}

              {diff.newValue !== undefined && (
                <div>
                  <Label className="text-xs font-medium">New Value</Label>
                  <div className="mt-1 p-2 bg-white/50 rounded border">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {typeof diff.newValue === 'object'
                        ? JSON.stringify(diff.newValue, null, 2)
                        : String(diff.newValue)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTextDiff = () => {
    const leftLines = leftJson.split('\n');
    const rightLines = rightJson.split('\n');

    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Original JSON</Label>
          <div className="border rounded-lg p-4 bg-muted/30">
            {leftLines.map((line, index) => (
              <div key={index} className="font-mono text-sm whitespace-pre-wrap">
                {options.showLineNumbers && (
                  <span className="text-gray-400 mr-2 select-none">
                    {(index + 1).toString().padStart(3, ' ')}
                  </span>
                )}
                {line}
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Compare JSON</Label>
          <div className="border rounded-lg p-4 bg-muted/30">
            {rightLines.map((line, index) => (
              <div key={index} className="font-mono text-sm whitespace-pre-wrap">
                {options.showLineNumbers && (
                  <span className="text-gray-400 mr-2 select-none">
                    {(index + 1).toString().padStart(3, ' ')}
                  </span>
                )}
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">JSON Diff</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare differences between two JSON objects, visualize additions, deletions, and modifications.
          </p>
        </div>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Compare Options
            </CardTitle>
            <CardDescription>
              Configure comparison behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showUnchanged"
                  checked={options.showUnchanged}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, showUnchanged: checked }))
                  }
                />
                <Label htmlFor="showUnchanged" className="text-sm cursor-pointer">
                  Show Unchanged
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="caseSensitive"
                  checked={options.caseSensitive}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, caseSensitive: checked }))
                  }
                />
                <Label htmlFor="caseSensitive" className="text-sm cursor-pointer">
                  Case Sensitive
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ignoreWhitespace"
                  checked={options.ignoreWhitespace}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, ignoreWhitespace: checked }))
                  }
                />
                <Label htmlFor="ignoreWhitespace" className="text-sm cursor-pointer">
                  Ignore Whitespace
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showLineNumbers"
                  checked={options.showLineNumbers}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, showLineNumbers: checked }))
                  }
                />
                <Label htmlFor="showLineNumbers" className="text-sm cursor-pointer">
                  Show Line Numbers
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* JSON Input Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Original JSON</CardTitle>
              <CardDescription>
                Enter the first JSON object
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={leftJson}
                onChange={(e) => setLeftJson(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Enter JSON content..."
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => formatJson(leftJson, 'left')}
                  className="flex-1"
                >
                  Format
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCopy(leftJson)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compare JSON</CardTitle>
              <CardDescription>
                Enter the second JSON object
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={rightJson}
                onChange={(e) => setRightJson(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Enter JSON content..."
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => formatJson(rightJson, 'right')}
                  className="flex-1"
                >
                  Format
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCopy(rightJson)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadSampleData} className="flex-1">
                Load Example
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {!isDiffValid && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Invalid JSON Format</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Please ensure the input JSON format is correct
              </p>
            </CardContent>
          </Card>
        )}

        {/* Comparison Result */}
        {isDiffValid && diffResult.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Diff Result
              </CardTitle>
              <CardDescription>
                Found {diffResult.length} differences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="text">Text Diff</TabsTrigger>
                </TabsList>

                <TabsContent value="visual" className="mt-6">
                  {renderVisualDiff()}
                </TabsContent>

                <TabsContent value="text" className="mt-6">
                  {renderTextDiff()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

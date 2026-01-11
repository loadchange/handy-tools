'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Switch } from '@/components/ui';
import {
  Timer,
  Play,
  RotateCcw,
  Download,
  BarChart3,
  Clock,
  Zap,
  CheckCircle,
  Code,
  Info
} from 'lucide-react';

interface BenchmarkTest {
  id: string;
  name: string;
  code: string;
  iterations: number;
  setup?: string;
  teardown?: string;
}

interface BenchmarkResult {
  testName: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  opsPerSecond: number;
  samples: number[];
}

const BENCHMARK_TEMPLATES = [
  {
    name: 'Array Traversal Performance',
    category: 'JavaScript',
    description: 'Test performance of different array traversal methods',
    tests: [
      {
        name: 'for loop',
        code: `
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
}`
      },
      {
        name: 'forEach',
        code: `
arr.forEach(item => {
  sum += item;
});`
      },
      {
        name: 'for...of',
        code: `
for (const item of arr) {
  sum += item;
}`
      },
      {
        name: 'reduce',
        code: `
sum = arr.reduce((acc, item) => acc + item, 0);`
      }
    ],
    setup: `
const arr = Array.from({length: 10000}, (_, i) => i);
let sum = 0;`,
    iterations: 1000
  },
  {
    name: 'String Concatenation Performance',
    category: 'JavaScript',
    description: 'Test performance of different string concatenation methods',
    tests: [
      {
        name: '+= operator',
        code: `
let result = '';
for (let i = 0; i < 1000; i++) {
  result += items[i];
}`
      },
      {
        name: 'join method',
        code: `
const result = items.join('');`
      },
      {
        name: 'array reduce',
        code: `
const result = items.reduce((acc, item) => acc + item, '');`
      },
      {
        name: 'template string',
        code: `
let result = '';
for (let i = 0; i < 1000; i++) {
  result = \`\${result}\${items[i]}\`;
}`
      }
    ],
    setup: `
const items = Array.from({length: 1000}, (_, i) => \`item\${i}\`);`,
    iterations: 1000
  },
  {
    name: 'Object Property Access',
    category: 'JavaScript',
    description: 'Test performance of different object property access methods',
    tests: [
      {
        name: 'Dot access',
        code: `
let result = 0;
for (let i = 0; i < 1000; i++) {
  result += obj.prop1 + obj.prop2 + obj.prop3;
}`
      },
      {
        name: 'Bracket access',
        code: `
let result = 0;
for (let i = 0; i < 1000; i++) {
  result += obj['prop1'] + obj['prop2'] + obj['prop3'];
}`
      },
      {
        name: 'Destructuring',
        code: `
let result = 0;
for (let i = 0; i < 1000; i++) {
  const {prop1, prop2, prop3} = obj;
  result += prop1 + prop2 + prop3;
}`
      }
    ],
    setup: `
const obj = {
  prop1: 100, prop2: 200, prop3: 300,
  prop4: 400, prop5: 500
};`,
    iterations: 10000
  }
];

export default function BenchmarkBuilderPage() {
  const [tests, setTests] = useState<BenchmarkTest[]>([]);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState<number>(-1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showSetupTeardown, setShowSetupTeardown] = useState(false);
  const [iterations, setIterations] = useState(1000);
  const [warmupRuns, setWarmupRuns] = useState(5);

  const loadTemplate = (templateName: string) => {
    const template = BENCHMARK_TEMPLATES.find(t => t.name === templateName);
    if (!template) return;

    const newTests: BenchmarkTest[] = template.tests.map((test, index) => ({
      id: `test_${Date.now()}_${index}`,
      name: test.name,
      code: test.code.trim(),
      iterations: template.iterations,
      setup: template.setup.trim(),
      teardown: ''
    }));

    setTests(newTests);
    setIterations(template.iterations);
    setSelectedTemplate(templateName);
  };

  const addTest = () => {
    const newTest: BenchmarkTest = {
      id: `test_${Date.now()}`,
      name: `Test ${tests.length + 1}`,
      code: `// Write test code here`,
      iterations: iterations
    };

    setTests([...tests, newTest]);
  };

  const updateTest = (id: string, field: keyof BenchmarkTest, value: string | number) => {
    setTests(tests.map(test =>
      test.id === id ? { ...test, [field]: value } : test
    ));
  };

  const removeTest = (id: string) => {
    setTests(tests.filter(test => test.id !== id));
  };

  const runBenchmark = async () => {
    if (tests.length === 0) return;

    setIsRunning(true);
    setResults([]);
    setCurrentTestIndex(0);

    const benchmarkResults: BenchmarkResult[] = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setCurrentTestIndex(i);

      try {
        const result = await runSingleTest(test);
        benchmarkResults.push(result);
        setResults([...benchmarkResults]);
      } catch (error) {
        console.error(`Test "${test.name}" execution failed:`, error);
      }

      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
    setCurrentTestIndex(-1);
  };

  const runSingleTest = async (test: BenchmarkTest): Promise<BenchmarkResult> => {
    const samples: number[] = [];

    // Warmup
    for (let i = 0; i < warmupRuns; i++) {
      try {
        await executeTest(test);
      } catch {
        // Ignore warmup errors
      }
    }

    // Actual Test
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();

      try {
        await executeTest(test);
        const endTime = performance.now();
        samples.push(endTime - startTime);
      } catch {
        // Ignore errors for now, but in real app handle them
        throw new Error('Test execution failed');
      }
    }

    const totalTime = samples.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / samples.length;
    const minTime = Math.min(...samples);
    const maxTime = Math.max(...samples);
    const opsPerSecond = 1000 / averageTime * test.iterations;

    return {
      testName: test.name,
      iterations: test.iterations,
      totalTime,
      averageTime,
      minTime,
      maxTime,
      opsPerSecond,
      samples
    };
  };

  const executeTest = async (test: BenchmarkTest): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Create safe execution environment
        const AsyncFunction = (async function() {}).constructor as FunctionConstructor;

        let code = '';
        if (test.setup) {
          code += test.setup + '\n';
        }

        // Wrap test code
        code += `
const startTime = performance.now();
for (let i = 0; i < ${test.iterations}; i++) {
  ${test.code}
}
const endTime = performance.now();
return endTime - startTime;
`;

        if (test.teardown) {
          code += '\n' + test.teardown;
        }

        const testFunction = new AsyncFunction(code);

        testFunction()
          .then(resolve)
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  };

  const clearAll = () => {
    setTests([]);
    setResults([]);
    setSelectedTemplate('');
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      tests: tests.map(t => ({
        name: t.name,
        iterations: t.iterations
      })),
      results: results
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getWinner = () => {
    if (results.length === 0) return null;
    return results.reduce((prev, current) =>
      prev.opsPerSecond > current.opsPerSecond ? prev : current
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Benchmark Builder</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create and run JavaScript performance benchmarks, compare execution efficiency of different implementations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Test Config */}
          <div className="lg:col-span-3 space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Test Templates
                </CardTitle>
                <CardDescription>
                  Select preset templates or create custom tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select value={selectedTemplate} onValueChange={loadTemplate}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select test template" />
                    </SelectTrigger>
                    <SelectContent>
                      {BENCHMARK_TEMPLATES.map((template, index) => (
                        <SelectItem key={index} value={template.name}>
                          {template.name} - {template.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addTest} variant="outline">
                    Add Custom Test
                  </Button>
                </div>

                {/* Test Config */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Iterations</Label>
                    <Input
                      type="number"
                      value={iterations}
                      onChange={(e) => setIterations(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Warmup Runs</Label>
                    <Input
                      type="number"
                      value={warmupRuns}
                      onChange={(e) => setWarmupRuns(Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Show Setup</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showSetupTeardown"
                        checked={showSetupTeardown}
                        onCheckedChange={setShowSetupTeardown}
                      />
                      <Label htmlFor="showSetupTeardown" className="text-sm cursor-pointer">
                        Setup/Teardown Code
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test List */}
            {tests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Cases</CardTitle>
                  <CardDescription>
                    Configure test cases to run
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="tests" className="w-full">
                    <TabsList>
                      <TabsTrigger value="tests">Test Code</TabsTrigger>
                      <TabsTrigger value="results">Test Results</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tests" className="space-y-4 mt-4">
                      {tests.map((test, index) => (
                        <div key={test.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Badge variant="outline">#{index + 1}</Badge>
                              <Input
                                value={test.name}
                                onChange={(e) => updateTest(test.id, 'name', e.target.value)}
                                className="max-w-xs"
                                placeholder="Test Name"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTest(test.id)}
                            >
                              Delete
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {showSetupTeardown && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Setup Code (Optional)</Label>
                                <Textarea
                                  value={test.setup || ''}
                                  onChange={(e) => updateTest(test.id, 'setup', e.target.value)}
                                  placeholder="Initialization code before test"
                                  className="font-mono text-sm"
                                  rows={3}
                                />
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Test Code</Label>
                              <Textarea
                                value={test.code}
                                onChange={(e) => updateTest(test.id, 'code', e.target.value)}
                                placeholder="Code to test"
                                className="font-mono text-sm"
                                rows={showSetupTeardown ? 3 : 5}
                              />
                            </div>

                            {showSetupTeardown && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Teardown Code (Optional)</Label>
                                <Textarea
                                  value={test.teardown || ''}
                                  onChange={(e) => updateTest(test.id, 'teardown', e.target.value)}
                                  placeholder="Cleanup code after test"
                                  className="font-mono text-sm"
                                  rows={3}
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm font-medium">Iterations:</Label>
                              <Input
                                type="number"
                                value={test.iterations}
                                onChange={(e) => updateTest(test.id, 'iterations', Number(e.target.value))}
                                className="w-24"
                                min="1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="results" className="space-y-4 mt-4">
                      {results.length > 0 ? (
                        <>
                          {/* Winner */}
                          {getWinner() && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 text-green-800">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-medium">Fastest Test: {getWinner()!.testName}</span>
                              </div>
                              <div className="text-sm text-green-700 mt-1">
                                {getWinner()!.opsPerSecond.toFixed(0)} ops/sec
                              </div>
                            </div>
                          )}

                          {/* Results */}
                          <div className="space-y-3">
                            {results.map((result, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline">{index + 1}</Badge>
                                    <span className="font-medium">{result.testName}</span>
                                  </div>
                                  {result === getWinner() && (
                                    <Badge className="bg-green-100 text-green-800">
                                      Fastest
                                    </Badge>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <div className="text-muted-foreground">Avg Time</div>
                                    <div className="font-semibold">
                                      {result.averageTime.toFixed(3)} ms
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Ops/Sec</div>
                                    <div className="font-semibold">
                                      {result.opsPerSecond.toFixed(0)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Min Time</div>
                                    <div className="font-semibold">
                                      {result.minTime.toFixed(3)} ms
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Max Time</div>
                                    <div className="font-semibold">
                                      {result.maxTime.toFixed(3)} ms
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                          <p>Run tests to see results here</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={runBenchmark}
                      disabled={isRunning || tests.length === 0}
                      className="flex-1"
                    >
                      {isRunning ? (
                        <>
                          <Timer className="h-4 w-4 mr-2 animate-spin" />
                          {currentTestIndex >= 0 && tests[currentTestIndex]
                            ? `Running ${tests[currentTestIndex].name}...`
                            : 'Running...'}
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Benchmark
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    {results.length > 0 && (
                      <Button variant="outline" onClick={exportResults}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            {/* Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Usage Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>1. Select Template:</strong> Choose a preset performance test template
                </div>
                <div>
                  <strong>2. Configure Test:</strong> Edit test code and iterations
                </div>
                <div>
                  <strong>3. Run Test:</strong> Click run button to start benchmark
                </div>
                <div>
                  <strong>4. View Results:</strong> Compare performance differences
                </div>
              </CardContent>
            </Card>

            {/* Performance Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>• Increase iterations for accuracy</div>
                <div>• Warmup runs help JIT optimization</div>
                <div>• Run multiple times in same env</div>
                <div>• Avoid console output in tests</div>
                <div>• Consider browser/engine differences</div>
              </CardContent>
            </Card>

            {/* Status */}
            {isRunning && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 animate-pulse" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Tests running...</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentTestIndex >= 0 && tests[currentTestIndex] && (
                        <div>
                          Current Test: {tests[currentTestIndex].name}
                          <br />
                          Progress: {currentTestIndex + 1}/{tests.length}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

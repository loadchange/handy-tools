'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Label } from '@/components/ui';
import { RefreshCw, Copy, FileText, Code, AlertTriangle } from 'lucide-react';
import yaml from 'js-yaml';

interface ConversionResult {
  output: string;
  isValid: boolean;
  error?: string;
}

export default function JsonToYamlPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [yamlOutput, setYamlOutput] = useState<ConversionResult | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [lineWidth, setLineWidth] = useState(120);

  const convertJsonToYaml = useCallback(() => {
    if (!jsonInput.trim()) {
      setYamlOutput({
        output: '',
        isValid: false,
        error: 'Please enter JSON content'
      });
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);

      const options: yaml.DumpOptions = {
        indent: indentSize,
        sortKeys: sortKeys,
        lineWidth: lineWidth,
        noRefs: false,
        noCompatMode: false,
        condenseFlow: false,
        quotingType: '"',
        forceQuotes: false
      };

      const yamlString = yaml.dump(parsedJson, options);

      setYamlOutput({
        output: yamlString,
        isValid: true
      });
    } catch (error) {
      setYamlOutput({
        output: '',
        isValid: false,
        error: error instanceof Error ? error.message : 'JSON Parse Error'
      });
    }
  }, [jsonInput, indentSize, sortKeys, lineWidth]);

  useEffect(() => {
    convertJsonToYaml();
  }, [jsonInput, indentSize, sortKeys, lineWidth, convertJsonToYaml]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setJsonInput('');
    setYamlOutput(null);
  };

  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setJsonInput(formattedJson);
    } catch (error) {
      console.error('Failed to format JSON:', error);
    }
  };

  const minifyJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const minifiedJson = JSON.stringify(parsedJson);
      setJsonInput(minifiedJson);
    } catch (error) {
      console.error('Failed to minify JSON:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">JSON to YAML Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert between JSON and YAML formats, with formatting and customization options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* JSON Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                JSON Input
              </CardTitle>
              <CardDescription>
                Enter JSON content to convert
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste JSON content, e.g.: {&#10;  &quot;name&quot;: &quot;John&quot;,&#10;  &quot;age&quot;: 30&#10;}"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[300px] resize-none font-mono text-sm"
              />

              {/* JSON Actions */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={formatJson} disabled={!jsonInput.trim()}>
                  Format
                </Button>
                <Button variant="outline" onClick={minifyJson} disabled={!jsonInput.trim()}>
                  Minify
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              {/* Status */}
              {yamlOutput && (
                <div className={`p-3 rounded-md ${
                  yamlOutput.isValid
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {yamlOutput.isValid ? (
                      <FileText className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${
                      yamlOutput.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {yamlOutput.isValid ? 'Valid JSON' : 'Invalid JSON'}
                    </span>
                  </div>
                  {yamlOutput.error && (
                    <p className="text-xs text-red-700 mt-1">{yamlOutput.error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* YAML Output */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                YAML Output
              </CardTitle>
              <CardDescription>
                Converted YAML content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="YAML output will be displayed here..."
                value={yamlOutput?.output || ''}
                readOnly
                className="min-h-[300px] resize-none font-mono text-sm"
              />

              {/* Output Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleCopy(yamlOutput?.output || '')}
                  disabled={!yamlOutput?.output}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy YAML
                </Button>
              </div>

              {/* Stats */}
              {yamlOutput?.output && (
                <div className="text-sm text-muted-foreground">
                  <p>• Lines: {yamlOutput.output.split('\n').length}</p>
                  <p>• Chars: {yamlOutput.output.length}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Options</CardTitle>
            <CardDescription>
              Customize YAML output format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Indent Size */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Indent Size</Label>
                <div className="flex gap-2">
                  {[2, 4, 8].map((size) => (
                    <Button
                      key={size}
                      variant={indentSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIndentSize(size)}
                    >
                      {size} Spaces
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort Keys */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sort Options</Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sortKeys" className="text-sm cursor-pointer">
                    Sort keys alphabetically
                  </Label>
                  <Switch
                    id="sortKeys"
                    checked={sortKeys}
                    onCheckedChange={setSortKeys}
                  />
                </div>
              </div>

              {/* Line Width */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Max Line Width</Label>
                <div className="flex gap-2">
                  {[80, 120, 200].map((width) => (
                    <Button
                      key={width}
                      variant={lineWidth === width ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLineWidth(width)}
                    >
                      {width}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Format Info */}
        <Card>
          <CardHeader>
            <CardTitle>Format Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">JSON Features</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div>• <strong>Strict Syntax</strong>: Braces/brackets must match</div>
                  <div>• <strong>Double Quotes</strong>: Strings require double quotes</div>
                  <div>• <strong>No Comments</strong>: Does not support comments</div>
                  <div>• <strong>Data Types</strong>: Strings, numbers, bools, arrays, objects</div>
                  <div>• <strong>No Trailing Commas</strong>: Not allowed</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">YAML Features</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div>• <strong>Concise</strong>: No braces, uses indentation</div>
                  <div>• <strong>Optional Quotes</strong>: Simple strings don&apos;t need quotes</div>
                  <div>• <strong>Comments</strong>: Supports # comments</div>
                  <div>• <strong>Data Types</strong>: Auto-detection, supports dates, null</div>
                  <div>• <strong>Readable</strong>: Closer to natural language</div>
                </div>
              </div>
            </div>

            {/* Example */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">Example Comparison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">JSON:</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`{
  "name": "John Doe",
  "age": 25,
  "married": false,
  "hobbies": ["Reading", "Swimming"]
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">YAML:</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`name: John Doe
age: 25
married: false
hobbies:
  - Reading
  - Swimming`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

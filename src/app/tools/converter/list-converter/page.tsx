'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Copy, ArrowRightLeft } from 'lucide-react';
import _ from 'lodash';

export default function ListConverterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState('comma');
  const [customSeparator, setCustomSeparator] = useState(',');
  const [outputSeparator, setOutputSeparator] = useState('newline');
  const [customOutputSeparator, setCustomOutputSeparator] = useState('\n');
  const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [deduplicate, setDeduplicate] = useState(false);
  const [trim, setTrim] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);

  const convert = useCallback(() => {
    let sep = customSeparator;
    if (separator === 'newline') sep = '\n';
    else if (separator === 'comma') sep = ',';
    else if (separator === 'space') sep = ' ';
    else if (separator === 'semicolon') sep = ';';

    let outSep = customOutputSeparator;
    if (outputSeparator === 'newline') outSep = '\n';
    else if (outputSeparator === 'comma') outSep = ',';
    else if (outputSeparator === 'comma-space') outSep = ', ';
    else if (outputSeparator === 'space') outSep = ' ';
    else if (outputSeparator === 'semicolon') outSep = ';';

    // Split
    let items = input.split(sep);

    // Process
    if (trim) items = items.map(i => i.trim());
    if (removeEmpty) items = items.filter(i => i.length > 0);
    if (deduplicate) items = _.uniq(items);

    if (sort === 'asc') items.sort();
    if (sort === 'desc') items.sort().reverse();

    // Join
    setOutput(items.join(outSep));

  }, [input, separator, customSeparator, outputSeparator, customOutputSeparator, sort, deduplicate, trim, removeEmpty]);

  useEffect(() => {
    convert();
  }, [convert]);

  const loadSample = () => {
    setInput('Apple, Banana, Orange, Grape, Apple, Banana');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">List Converter</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Convert lists between different delimiters, sort, and deduplicate items.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Input Delimiter</Label>
                <Select value={separator} onValueChange={setSeparator}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comma">Comma (,)</SelectItem>
                    <SelectItem value="newline">New Line (\n)</SelectItem>
                    <SelectItem value="space">Space ( )</SelectItem>
                    <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {separator === 'custom' && (
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={customSeparator}
                    onChange={(e) => setCustomSeparator(e.target.value)}
                    placeholder="Custom separator"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Output Delimiter</Label>
                <Select value={outputSeparator} onValueChange={setOutputSeparator}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newline">New Line (\n)</SelectItem>
                    <SelectItem value="comma">Comma (,)</SelectItem>
                    <SelectItem value="comma-space">Comma + Space (, )</SelectItem>
                    <SelectItem value="space">Space ( )</SelectItem>
                    <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                 {outputSeparator === 'custom' && (
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={customOutputSeparator}
                    onChange={(e) => setCustomOutputSeparator(e.target.value)}
                    placeholder="Custom separator"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Select value={sort} onValueChange={(v: 'none' | 'asc' | 'desc') => setSort(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Original Order</SelectItem>
                    <SelectItem value="asc">Ascending (A-Z)</SelectItem>
                    <SelectItem value="desc">Descending (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="deduplicate">Remove Duplicates</Label>
                <Switch id="deduplicate" checked={deduplicate} onCheckedChange={setDeduplicate} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="trim">Trim Whitespace</Label>
                <Switch id="trim" checked={trim} onCheckedChange={setTrim} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="removeEmpty">Remove Empty Lines</Label>
                <Switch id="removeEmpty" checked={removeEmpty} onCheckedChange={setRemoveEmpty} />
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Input/Output */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Input List</span>
                <Button variant="outline" size="sm" onClick={loadSample}>Load Sample</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your list here..."
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <ArrowRightLeft className="h-6 w-6 text-muted-foreground rotate-90 lg:rotate-0" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Output List</span>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(output)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
                className="min-h-[200px]"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                Total items: {output ? output.split(outputSeparator === 'newline' ? '\n' : customOutputSeparator).length : 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { ScrollArea } from '@/components/ui';
import {
  Hash,
  Copy,
  FileText,
  Zap,
  Book,
  Code,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface NumeronymExample {
  original: string;
  numeronym: string;
  description: string;
}

interface ConversionRule {
  name: string;
  description: string;
  convert: (text: string) => string;
  examples: string[];
}

const COMMON_NUMERONYMS: NumeronymExample[] = [
  { original: 'internationalization', numeronym: 'i18n', description: 'Internationalization' },
  { original: 'localization', numeronym: 'l10n', description: 'Localization' },
  { original: 'accessibility', numeronym: 'a11y', description: 'Accessibility' },
  { original: 'regular expression', numeronym: 'r3x', description: 'Regular Expression' },
  { original: 'application programming interface', numeronym: 'api', description: 'API' },
  { original: 'content management system', numeronym: 'cms', description: 'CMS' },
  { original: 'user interface', numeronym: 'ui', description: 'User Interface' },
  { original: 'user experience', numeronym: 'ux', description: 'User Experience' },
  { original: 'asynchronous JavaScript and XML', numeronym: 'ajax', description: 'Async JS' },
  { original: 'database management system', numeronym: 'dbms', description: 'DBMS' },
  { original: 'operating system', numeronym: 'os', description: 'Operating System' },
  { original: 'search engine optimization', numeronym: 'seo', description: 'SEO' },
  { original: 'customer relationship management', numeronym: 'crm', description: 'CRM' },
  { original: 'enterprise resource planning', numeronym: 'erp', description: 'ERP' },
  { original: 'business intelligence', numeronym: 'bi', description: 'Business Intelligence' }
];

const CONVERSION_RULES: ConversionRule[] = [
  {
    name: 'standard',
    description: 'Standard: First + Count + Last',
    convert: (text) => {
      const trimmed = text.trim();
      if (trimmed.length <= 2) return trimmed;
      return `${trimmed[0]}${trimmed.length - 2}${trimmed[trimmed.length - 1]}`;
    },
    examples: ['internationalization → i18n', 'accessibility → a11y']
  },
  {
    name: 'acronym',
    description: 'Acronym: First letter of each word',
    convert: (text) => {
      return text.trim().split(/\s+/).map(word => word[0]).join('').toUpperCase();
    },
    examples: ['user interface → UI', 'as soon as possible → ASAP']
  },
  {
    name: 'word-count',
    description: 'Word Count: First + Word Count + Last',
    convert: (text) => {
      const words = text.trim().split(/\s+/);
      if (words.length === 1) return words[0];
      return `${words[0][0]}${words.length - 1}${words[words.length - 1][words[words.length - 1].length - 1]}`;
    },
    examples: ['as soon as possible → a3p', 'content management system → c3m']
  },
  {
    name: 'syllable-count',
    description: 'Syllable Count: First + Syllable Count + Last (Simplified)',
    convert: (text) => {
      const syllableCount = Math.ceil(text.trim().length / 3); // Simplified estimation
      const trimmed = text.trim();
      if (syllableCount <= 1) return trimmed;
      return `${trimmed[0]}${syllableCount}${trimmed[trimmed.length - 1]}`;
    },
    examples: ['internationalization → i6n', 'accessibility → a4y']
  },
  {
    name: 'vowel-count',
    description: 'Vowel Count: First + Vowel Count + Last',
    convert: (text) => {
      const vowels = text.trim().toLowerCase().match(/[aeiou]/g) || [];
      const trimmed = text.trim();
      if (vowels.length <= 1) return trimmed;
      return `${trimmed[0]}${vowels.length}${trimmed[trimmed.length - 1]}`;
    },
    examples: ['internationalization → i8n', 'accessibility → a6y']
  },
  {
    name: 'consonant-count',
    description: 'Consonant Count: First + Consonant Count + Last',
    convert: (text) => {
      const consonants = text.trim().toLowerCase().match(/[bcdfghjklmnpqrstvwxyz]/g) || [];
      const trimmed = text.trim();
      if (consonants.length <= 1) return trimmed;
      return `${trimmed[0]}${consonants.length}${trimmed[trimmed.length - 1]}`;
    },
    examples: ['internationalization → i12n', 'accessibility → a7y']
  }
];

export default function NumeronymGeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [selectedRule, setSelectedRule] = useState('standard');
  const [copied, setCopied] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchText, setBatchText] = useState('');

  const currentRule = CONVERSION_RULES.find(rule => rule.name === selectedRule);
  const numeronym = useMemo(() => {
    return currentRule ? currentRule.convert(inputText) : '';
  }, [inputText, currentRule]);

  const batchResults = useMemo(() => {
    if (!batchMode || !batchText.trim()) return [];

    return batchText.trim().split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => ({
        original: line,
        numeronym: currentRule ? currentRule.convert(line) : ''
      }));
  }, [batchText, batchMode, currentRule]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyBatchResults = () => {
    const results = batchResults.map(r => `${r.original} → ${r.numeronym}`).join('\n');
    copyToClipboard(results);
  };

  const loadExample = (example: NumeronymExample) => {
    setInputText(example.original);
    setSelectedRule('standard');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Numeronym Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert phrases to numeronyms (like i18n), supporting various rules and batch processing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Functionality */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Selection */}
            <Tabs value={batchMode ? "batch" : "single"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single" onClick={() => setBatchMode(false)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Single Conversion
                </TabsTrigger>
                <TabsTrigger value="batch" onClick={() => setBatchMode(true)}>
                  <Zap className="h-4 w-4 mr-2" />
                  Batch Conversion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-6">
                {/* Input Area */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Input Phrase
                    </CardTitle>
                    <CardDescription>
                      Enter phrase or word to convert
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter phrase..."
                      className="text-lg"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{inputText.length} chars</span>
                      <Button variant="ghost" size="sm" onClick={() => setInputText('')}>
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Rule Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Conversion Rules
                    </CardTitle>
                    <CardDescription>
                      Select conversion algorithm
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {CONVERSION_RULES.map((rule) => (
                        <Button
                          key={rule.name}
                          variant={selectedRule === rule.name ? "default" : "outline"}
                          onClick={() => setSelectedRule(rule.name)}
                          className="h-auto p-4 text-left"
                        >
                          <div className="w-full">
                            <div className="font-medium text-sm mb-1">{rule.name}</div>
                            <div className="text-xs text-muted-foreground mb-2">{rule.description}</div>
                            <div className="text-xs bg-muted p-2 rounded font-mono">
                              {rule.examples[0]}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Result */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Conversion Result
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(numeronym)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {currentRule?.description} processed result
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-6 rounded-lg text-center">
                      <div className="text-2xl font-mono font-bold text-primary mb-2">
                        {numeronym || 'Result will appear here...'}
                      </div>
                      {inputText && numeronym && (
                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                          <span>{inputText}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{numeronym}</span>
                        </div>
                      )}
                    </div>

                    {copied && (
                      <div className="mt-4 text-sm text-green-600 flex items-center gap-2 justify-center">
                        <CheckCircle className="h-4 w-4" />
                        <span>Copied to clipboard</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="batch" className="space-y-6">
                {/* Batch Input */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Batch Input
                    </CardTitle>
                    <CardDescription>
                      One phrase per line, supports batch conversion
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <textarea
                      value={batchText}
                      onChange={(e) => setBatchText(e.target.value)}
                      placeholder="One phrase per line...&#10;internationalization&#10;localization&#10;accessibility"
                      className="w-full min-h-[120px] p-3 border rounded-md resize-none font-mono text-sm"
                      rows={6}
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{batchText.split('\n').filter(line => line.trim()).length} phrases</span>
                      <Button variant="ghost" size="sm" onClick={() => setBatchText('')}>
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Batch Result */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Batch Result
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyBatchResults}
                        disabled={batchResults.length === 0}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {currentRule?.description} processed result
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full">
                      <div className="space-y-2">
                        {batchResults.map((result, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-sm">{result.original}</div>
                              <div className="text-lg font-mono font-bold text-primary">
                                {result.numeronym}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(result.numeronym)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        {batchResults.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Batch results will appear here</p>
                            <p className="text-sm">Enter phrases above to batch convert</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {copied && (
                      <div className="mt-4 text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Batch results copied</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-6">
            {/* Common Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Common Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full">
                  <div className="space-y-2">
                    {COMMON_NUMERONYMS.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(example)}
                        className="w-full h-auto p-3 text-left"
                      >
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-sm">{example.numeronym}</span>
                            <Badge variant="outline" className="text-xs">
                              {example.description}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {example.original}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Rule Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Rule Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {currentRule && (
                  <div>
                    <div className="font-medium mb-2">{currentRule.name}</div>
                    <div className="text-muted-foreground mb-3">{currentRule.description}</div>
                    <div className="space-y-1">
                      {currentRule.examples.map((example, index) => (
                        <div key={index} className="font-mono text-xs bg-muted p-2 rounded">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Usage Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Best Practices:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Use Standard for long words</li>
                    <li>• Use Acronym for phrases</li>
                    <li>• Tech terms often use numeronyms</li>
                  </ul>
                </div>
                <div>
                  <strong>Applications:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Software terminology</li>
                    <li>• Tech docs abbreviation</li>
                    <li>• Code naming conventions</li>
                  </ul>
                </div>
                <div>
                  <strong>Notes:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Maintain consistency</li>
                    <li>• Avoid ambiguity</li>
                    <li>• Consider audience understanding</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Rules:</span>
                  <span className="font-semibold">{CONVERSION_RULES.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Examples:</span>
                  <span className="font-semibold">{COMMON_NUMERONYMS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Input:</span>
                  <span className="font-semibold">{inputText.length} chars</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Result:</span>
                  <span className="font-semibold">{numeronym.length} chars</span>
                </div>
                <div className="flex justify-between">
                  <span>Compression:</span>
                  <span className="font-semibold">
                    {inputText.length > 0
                      ? Math.round((1 - numeronym.length / inputText.length) * 100) + '%'
                      : '0%'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

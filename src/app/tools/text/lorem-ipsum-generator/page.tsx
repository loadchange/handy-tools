'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Slider } from '@/components/ui';
import {
  FileText,
  Copy,
  RefreshCw,
  Download,
  Type,
  Hash,
  List,
  Settings,
  Info
} from 'lucide-react';

interface LoremConfig {
  paragraphs: number;
  sentencesPerParagraph: number;
  wordsPerSentence: number;
  startWithLorem: boolean;
  includePunctuation: boolean;
  capitalizeFirst: boolean;
  format: 'plain' | 'html';
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in',
  'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum'
];

const QUICK_TEMPLATES = [
  { name: 'Short Paragraph', paragraphs: 1, sentences: 3, words: 8 },
  { name: 'Medium Article', paragraphs: 3, sentences: 5, words: 12 },
  { name: 'Long Article', paragraphs: 5, sentences: 8, words: 15 },
  { name: 'Demo Content', paragraphs: 2, sentences: 4, words: 10 }
];

export default function LoremIpsumGeneratorPage() {
  const [generatedText, setGeneratedText] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const [config, setConfig] = useState<LoremConfig>({
    paragraphs: 3,
    sentencesPerParagraph: 5,
    wordsPerSentence: 10,
    startWithLorem: true,
    includePunctuation: true,
    capitalizeFirst: true,
    format: 'plain'
  });

  // Removed language state as we only support Latin now

  const generateRandomWord = (): string => {
    return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  };

  const generateSentence = (): string => {
    const words = [];
    const targetLength = config.wordsPerSentence + Math.floor(Math.random() * 5) - 2;

    for (let i = 0; i < targetLength; i++) {
      words.push(generateRandomWord());
    }

    let sentence = words.join(' ');

    sentence = sentence.charAt(0).toLowerCase() + sentence.slice(1);

    if (config.capitalizeFirst) {
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    if (config.includePunctuation) {
      sentence += '.';
    }

    return sentence;
  };

  const generateParagraph = (): string => {
    const sentences = [];
    const targetLength = config.sentencesPerParagraph + Math.floor(Math.random() * 3) - 1;

    for (let i = 0; i < targetLength; i++) {
      sentences.push(generateSentence());
    }

    return sentences.join(' ');
  };

  const generateText = useCallback(() => {
    let result = '';
    const paragraphs = [];

    for (let i = 0; i < config.paragraphs; i++) {
      paragraphs.push(generateParagraph());
    }

    if (config.startWithLorem) {
      result = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
    }

    result += paragraphs.join('\n\n');

    if (config.format === 'html') {
      result = paragraphs
        .map(p => `<p>${p}</p>`)
        .join('\n');
      if (config.startWithLorem) {
        result = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n` + result;
      }
    }

    setGeneratedText(result);

    // Stats
    const textWithoutHTML = result.replace(/<[^>]*>/g, '');
    setCharCount(textWithoutHTML.length);
    setWordCount(textWithoutHTML.split(/\s+/).filter(word => word.length > 0).length);
  }, [config]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const downloadAsFile = () => {
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorem-ipsum-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    setConfig(prev => ({
      ...prev,
      paragraphs: template.paragraphs,
      sentencesPerParagraph: template.sentences,
      wordsPerSentence: template.words
    }));
  };

  const clearText = () => {
    setGeneratedText('');
    setCharCount(0);
    setWordCount(0);
  };

  const updateConfig = (key: keyof LoremConfig, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    generateText();
  }, [generateText]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Lorem Ipsum Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate placeholder text with customizable paragraphs, sentences, and words.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Generator and Config */}
          <div className="lg:col-span-2 space-y-6">
            {/* Config Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Generation Config
                </CardTitle>
                <CardDescription>
                  Customize generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Templates */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quick Templates</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_TEMPLATES.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadTemplate(template)}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Paragraphs */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Paragraphs: {config.paragraphs}
                  </Label>
                  <Slider
                    value={[config.paragraphs]}
                    onValueChange={(value) => updateConfig('paragraphs', value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Sentences per Paragraph */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Sentences per Paragraph: {config.sentencesPerParagraph}
                  </Label>
                  <Slider
                    value={[config.sentencesPerParagraph]}
                    onValueChange={(value) => updateConfig('sentencesPerParagraph', value[0])}
                    max={15}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Words per Sentence */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Words per Sentence: {config.wordsPerSentence}
                  </Label>
                  <Slider
                    value={[config.wordsPerSentence]}
                    onValueChange={(value) => updateConfig('wordsPerSentence', value[0])}
                    max={25}
                    min={3}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Output Format */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Output Format</Label>
                    <Select value={config.format} onValueChange={(value) => updateConfig('format', value as 'plain' | 'html')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plain">Plain Text</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Start with Lorem</span>
                        <Switch
                          checked={config.startWithLorem}
                          onCheckedChange={(checked) => updateConfig('startWithLorem', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Include Punctuation</span>
                        <Switch
                          checked={config.includePunctuation}
                          onCheckedChange={(checked) => updateConfig('includePunctuation', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Capitalize First</span>
                        <Switch
                          checked={config.capitalizeFirst}
                          onCheckedChange={(checked) => updateConfig('capitalizeFirst', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={generateText} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button variant="outline" onClick={clearText}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generated Result
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {charCount} Chars
                    </Badge>
                    <Badge variant="outline">
                      {wordCount} Words
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  Placeholder Text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={generatedText}
                    readOnly
                    className="min-h-[300px] font-mono text-sm resize-none"
                    placeholder="Generated text will appear here..."
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                {/* Copy Success */}
                {copySuccess && (
                  <div className="text-sm text-green-600 flex items-center gap-2">
                    <span>✓</span>
                    <span>Copied to clipboard</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </Button>
                  <Button onClick={downloadAsFile} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-6">
            {/* Usage Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Usage Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Web Design:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Prototype placeholder</li>
                    <li>• Layout testing content</li>
                    <li>• Font effect demo</li>
                  </ul>
                </div>
                <div>
                  <strong>Print Design:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Book layout sample</li>
                    <li>• Poster text layout</li>
                    <li>• Business card demo</li>
                  </ul>
                </div>
                <div>
                  <strong>Dev Testing:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• API data mock</li>
                    <li>• Functional test content</li>
                    <li>• Performance test text</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* About Lorem Ipsum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About Lorem Ipsum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Origin:</strong>
                  <p className="mt-1">
                    Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC.
                  </p>
                </div>
                <div>
                  <strong>Features:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Uniform letter distribution</li>
                    <li>• Non-distracting</li>
                    <li>• Resembles real text</li>
                    <li>• International standard</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Paragraphs:</span>
                  <span className="font-semibold">{config.paragraphs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Sentences:</span>
                  <span className="font-semibold">
                    {config.paragraphs * config.sentencesPerParagraph}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Words:</span>
                  <span className="font-semibold">
                    {config.paragraphs * config.sentencesPerParagraph * config.wordsPerSentence}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span>Actual Chars:</span>
                    <span className="font-semibold">{charCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual Words:</span>
                    <span className="font-semibold">{wordCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <strong>Ctrl+C:</strong> Copy text
                </div>
                <div>
                  <strong>Ctrl+S:</strong> Download file
                </div>
                <div>
                  <strong>F5:</strong> Regenerate
                </div>
                <div>
                  <strong>Tab:</strong> Toggle options
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

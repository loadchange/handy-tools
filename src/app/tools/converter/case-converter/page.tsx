'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Type, Copy, RefreshCw } from 'lucide-react';

interface CaseConversion {
  upperCase: string;
  lowerCase: string;
  titleCase: string;
  camelCase: string;
  pascalCase: string;
  snakeCase: string;
  kebabCase: string;
  constantCase: string;
  sentenceCase: string;
  alternatingCase: string;
  inverseCase: string;
}

const convertToTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const convertToCamelCase = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
};

const convertToPascalCase = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
    return word.toUpperCase();
  }).replace(/\s+/g, '');
};

const convertToSnakeCase = (str: string): string => {
  return str.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
};

const convertToKebabCase = (str: string): string => {
  return str.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-');
};

const convertToConstantCase = (str: string): string => {
  return convertToSnakeCase(str).toUpperCase();
};

const convertToSentenceCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const convertToAlternatingCase = (str: string): string => {
  return str.split('').map((char, index) =>
    index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
  ).join('');
};

const convertToInverseCase = (str: string): string => {
  return str.split('').map(char =>
    char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
  ).join('');
};

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState('');
  const [conversions, setConversions] = useState<CaseConversion>({
    upperCase: '',
    lowerCase: '',
    titleCase: '',
    camelCase: '',
    pascalCase: '',
    snakeCase: '',
    kebabCase: '',
    constantCase: '',
    sentenceCase: '',
    alternatingCase: '',
    inverseCase: '',
  });

  useEffect(() => {
    const conversions: CaseConversion = {
      upperCase: inputText.toUpperCase(),
      lowerCase: inputText.toLowerCase(),
      titleCase: convertToTitleCase(inputText),
      camelCase: convertToCamelCase(inputText),
      pascalCase: convertToPascalCase(inputText),
      snakeCase: convertToSnakeCase(inputText),
      kebabCase: convertToKebabCase(inputText),
      constantCase: convertToConstantCase(inputText),
      sentenceCase: convertToSentenceCase(inputText),
      alternatingCase: convertToAlternatingCase(inputText),
      inverseCase: convertToInverseCase(inputText),
    };
    setConversions(conversions);
  }, [inputText]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    });
  };

  const handleClear = () => {
    setInputText('');
  };

  const CaseCard = ({
    title,
    value,
    description
  }: {
    title: string;
    value: string;
    description: string;
  }) => (
    <div className="group relative">
      <div className="p-3 bg-muted rounded-md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(value)}
            className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <div className="font-mono text-sm break-all">
          {value || <span className="text-muted-foreground">-</span>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Case Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert text to various case formats, suitable for programming and documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Input Text
              </CardTitle>
              <CardDescription>
                Enter text to convert
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {inputText.length} chars
                </span>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Results */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CaseCard
                title="UPPER CASE"
                value={conversions.upperCase}
                description="All Uppercase"
              />
              <CaseCard
                title="lower case"
                value={conversions.lowerCase}
                description="All Lowercase"
              />
              <CaseCard
                title="Title Case"
                value={conversions.titleCase}
                description="Title Case"
              />
              <CaseCard
                title="camelCase"
                value={conversions.camelCase}
                description="Camel Case"
              />
              <CaseCard
                title="PascalCase"
                value={conversions.pascalCase}
                description="Pascal Case"
              />
            </CardContent>
          </Card>
        </div>

        {/* More Formats */}
        <Card>
          <CardHeader>
            <CardTitle>More Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CaseCard
                title="snake_case"
                value={conversions.snakeCase}
                description="Snake Case"
              />
              <CaseCard
                title="kebab-case"
                value={conversions.kebabCase}
                description="Kebab Case"
              />
              <CaseCard
                title="CONSTANT_CASE"
                value={conversions.constantCase}
                description="Constant Case"
              />
              <CaseCard
                title="Sentence case"
                value={conversions.sentenceCase}
                description="Sentence Case"
              />
              <CaseCard
                title="AlTeRnAtInG CaSe"
                value={conversions.alternatingCase}
                description="Alternating Case"
              />
              <CaseCard
                title="iNVERSE cASE"
                value={conversions.inverseCase}
                description="Inverse Case"
              />
            </div>
          </CardContent>
        </Card>

        {/* User Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Naming Conventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Programming Languages</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li><strong>JavaScript/Java</strong>: camelCase</li>
                  <li><strong>Python/Ruby</strong>: snake_case</li>
                  <li><strong>C#/Pascal</strong>: PascalCase</li>
                  <li><strong>C++/Java Constants</strong>: CONSTANT_CASE</li>
                  <li><strong>CSS/Lisp</strong>: kebab-case</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Documentation</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li><strong>Headings</strong>: Title Case</li>
                  <li><strong>Body</strong>: Sentence case</li>
                  <li><strong>Emphasis</strong>: UPPER CASE</li>
                  <li><strong>Code Identifiers</strong>: kebab-case</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Maintain consistency</li>
                  <li>• Use meaningful names</li>
                  <li>• Avoid overly long names</li>
                  <li>• Follow team conventions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

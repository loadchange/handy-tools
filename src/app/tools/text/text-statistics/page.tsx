'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { FileText, Hash, Type, AlignLeft } from 'lucide-react';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
}

export default function TextStatisticsPage() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const calculateStats = (inputText: string): TextStats => {
      if (!inputText.trim()) {
        return {
          characters: 0,
          charactersNoSpaces: 0,
          words: 0,
          lines: 0,
          sentences: 0,
          paragraphs: 0,
          readingTime: 0,
        };
      }

      // Basic stats
      const characters = inputText.length;
      const charactersNoSpaces = inputText.replace(/\s/g, '').length;

      // Lines
      const lines = inputText.split('\n').length;

      // Words
      const words = inputText
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .length;

      // Sentences
      const sentences = (inputText.match(/[.!?]+/g) || []).length ||
                       (inputText.trim() ? 1 : 0);

      // Paragraphs
      const paragraphs = inputText
        .split(/\n\s*\n/)
        .filter(p => p.trim().length > 0)
        .length || (inputText.trim() ? 1 : 0);

      // Reading Time (200 wpm)
      const readingTime = Math.ceil(words / 200);

      return {
        characters,
        charactersNoSpaces,
        words,
        lines,
        sentences,
        paragraphs,
        readingTime,
      };
    };

    setStats(calculateStats(text));
  }, [text]);

  const handleClear = () => {
    setText('');
    setStats({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: 0,
    });
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    description
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    description: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Text Statistics</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analyze text statistics including character count, word count, line count, and more. Supports English and mixed text.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Input Text
              </CardTitle>
              <CardDescription>
                Enter or paste text to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {text.length} chars
                </span>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Result */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Statistics Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    icon={Type}
                    title="Characters"
                    value={stats.characters.toLocaleString()}
                    description="Includes spaces"
                  />
                  <StatCard
                    icon={Type}
                    title="Characters"
                    value={stats.charactersNoSpaces.toLocaleString()}
                    description="Excludes spaces"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={AlignLeft}
                title="Words"
                value={stats.words.toLocaleString()}
                description="Count"
              />
              <StatCard
                icon={AlignLeft}
                title="Lines"
                value={stats.lines.toLocaleString()}
                description="Includes empty lines"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={AlignLeft}
                title="Sentences"
                value={stats.sentences.toLocaleString()}
                description="Ends with punctuation"
              />
              <StatCard
                icon={AlignLeft}
                title="Paragraphs"
                value={stats.paragraphs.toLocaleString()}
                description="Separated by empty lines"
              />
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Estimated Reading Time</p>
                    <p className="text-2xl font-bold text-primary">
                      {stats.readingTime} min
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Based on 200 words/min
                    </p>
                  </div>
                  <div className="text-4xl">⏱️</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

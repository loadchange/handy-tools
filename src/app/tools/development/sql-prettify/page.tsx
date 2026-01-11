'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Label } from '@/components/ui';
import { Copy, Settings } from 'lucide-react';
import { format } from 'sql-formatter';
import type { SqlLanguage, KeywordCase } from 'sql-formatter';

export default function SqlPrettifyPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState<SqlLanguage>('sql');
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const formatted = format(input, {
        language: dialect,
        keywordCase: keywordCase,
      });
      setOutput(formatted);
    } catch {
      setOutput(input); // Fallback to original
    }
  }, [input, dialect, keywordCase]);

  const loadSample = () => {
    setInput('SELECT * FROM users WHERE id = 1 AND name = "John" GROUP BY department ORDER BY created_at DESC');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">SQL Prettify</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Format and beautify your SQL queries.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6">
            <div className="space-y-2 min-w-[200px]">
              <Label>Dialect</Label>
              <Select value={dialect} onValueChange={(v) => setDialect(v as SqlLanguage)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sql">Standard SQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="mariadb">MariaDB</SelectItem>
                  <SelectItem value="tsql">T-SQL (SQL Server)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 min-w-[200px]">
              <Label>Keyword Case</Label>
              <Select value={keywordCase} onValueChange={(v) => setKeywordCase(v as KeywordCase)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upper">UPPERCASE</SelectItem>
                  <SelectItem value="lower">lowercase</SelectItem>
                  <SelectItem value="preserve">Preserve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SQL Input</span>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={loadSample}>Load Sample</Button>
                   <Button variant="outline" size="sm" onClick={() => setInput('')}>Clear</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="SELECT * FROM table..."
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Formatted Output</span>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                className="min-h-[400px] font-mono text-sm"
                placeholder="Formatted SQL will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Copy, RefreshCw, Clock, Calendar, ChevronRight, Info, Zap } from 'lucide-react';

interface CronParts {
  minute: string;
  hour: string;
  day: string;
  month: string;
  weekday: string;
}

interface CronExample {
  name: string;
  description: string;
  cron: CronParts;
  nextRuns: string[];
}

const COMMON_CRON_EXAMPLES: CronExample[] = [
  {
    name: 'Every Minute',
    description: 'Runs every minute',
    cron: { minute: '*', hour: '*', day: '*', month: '*', weekday: '*' },
    nextRuns: []
  },
  {
    name: 'Every Hour',
    description: 'Runs at minute 0 of every hour',
    cron: { minute: '0', hour: '*', day: '*', month: '*', weekday: '*' },
    nextRuns: []
  },
  {
    name: 'Every Midnight',
    description: 'Runs at 00:00 every day',
    cron: { minute: '0', hour: '0', day: '*', month: '*', weekday: '*' },
    nextRuns: []
  },
  {
    name: 'Every Monday 9AM',
    description: 'Runs at 09:00 on every Monday',
    cron: { minute: '0', hour: '9', day: '*', month: '*', weekday: '1' },
    nextRuns: []
  },
  {
    name: '1st of Month',
    description: 'Runs at 00:00 on day 1 of every month',
    cron: { minute: '0', hour: '0', day: '1', month: '*', weekday: '*' },
    nextRuns: []
  },
  {
    name: 'Weekdays 9AM',
    description: 'Runs at 09:00 on Mon-Fri',
    cron: { minute: '0', hour: '9', day: '*', month: '*', weekday: '1-5' },
    nextRuns: []
  },
  {
    name: 'Every 30 Minutes',
    description: 'Runs every 30 minutes',
    cron: { minute: '*/30', hour: '*', day: '*', month: '*', weekday: '*' },
    nextRuns: []
  },
  {
    name: 'Every 2 Hours',
    description: 'Runs every 2 hours',
    cron: { minute: '0', hour: '*/2', day: '*', month: '*', weekday: '*' },
    nextRuns: []
  }
];

export default function CrontabGeneratorPage() {
  const [cronParts, setCronParts] = useState<CronParts>({
    minute: '*',
    hour: '*',
    day: '*',
    month: '*',
    weekday: '*'
  });
  const [cronExpression, setCronExpression] = useState('* * * * *');
  const [nextRuns, setNextRuns] = useState<string[]>([]);

  const minuteOptions = ['*', '0', '15', '30', '45', '*/15', '*/30'];
  const hourOptions = ['*', '0', '6', '12', '18', '*/6', '*/12'];
  const dayOptions = ['*', '1', '15', 'L', '*/15'];
  const monthOptions = ['*', '1', '6', '12', '*/6'];
  const weekdayOptions = ['*', '0', '1', '2', '3', '4', '5', '6', '1-5', '0,6'];

  useEffect(() => {
    const expression = `${cronParts.minute} ${cronParts.hour} ${cronParts.day} ${cronParts.month} ${cronParts.weekday}`;
    setCronExpression(expression);
    calculateNextRuns(expression);
  }, [cronParts]);

  const calculateNextRuns = (expression: string) => {
    const runs: string[] = [];
    const now = new Date();

    // Simplified next run calculation (for demo purposes)
    try {
      const parts = expression.split(' ');
      const nextDate = new Date(now);

      // Simple calculation based on minute
      if (parts[0] === '*') {
        nextDate.setMinutes(nextDate.getMinutes() + 1);
      } else if (parts[0].startsWith('*/')) {
        const interval = parseInt(parts[0].substring(2));
        nextDate.setMinutes(Math.floor(nextDate.getMinutes() / interval) * interval + interval);
      } else {
        nextDate.setMinutes(parseInt(parts[0]));
      }

      // Generate next 5 runs
      for (let i = 0; i < 5; i++) {
        const runDate = new Date(nextDate.getTime() + i * 60000);
        runs.push(runDate.toLocaleString());
      }
    } catch {
      runs.push('Calculation Error, please check expression');
    }

    setNextRuns(runs);
  };

  const updateCronPart = (part: keyof CronParts, value: string) => {
    setCronParts(prev => ({
      ...prev,
      [part]: value
    }));
  };

  const loadExample = (example: CronExample) => {
    setCronParts(example.cron);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const clearAll = () => {
    setCronParts({
      minute: '*',
      hour: '*',
      day: '*',
      month: '*',
      weekday: '*'
    });
  };

  const parseExpression = (expression: string) => {
    const parts = expression.trim().split(/\s+/);
    if (parts.length === 5) {
      setCronParts({
        minute: parts[0],
        hour: parts[1],
        day: parts[2],
        month: parts[3],
        weekday: parts[4]
      });
    }
  };

  const getPartDescription = (part: string, type: string): string => {
    switch (type) {
      case 'minute':
        if (part === '*') return 'Every Minute';
        if (part.startsWith('*/')) return `Every ${part.substring(2)} minutes`;
        return `At minute ${part}`;
      case 'hour':
        if (part === '*') return 'Every Hour';
        if (part.startsWith('*/')) return `Every ${part.substring(2)} hours`;
        return `At ${part} hour`;
      case 'day':
        if (part === '*') return 'Every Day';
        if (part === 'L') return 'Last day of month';
        if (part.startsWith('*/')) return `Every ${part.substring(2)} days`;
        return `On day ${part}`;
      case 'month':
        if (part === '*') return 'Every Month';
        if (part.startsWith('*/')) return `Every ${part.substring(2)} months`;
        return `In month ${part}`;
      case 'weekday':
        if (part === '*') return 'Every Weekday';
        if (part === '0,6') return 'Weekend';
        if (part === '1-5') return 'Weekdays';
        if (part.includes(',')) return `Days: ${part}`;
        return `Day ${part}`;
      default:
        return part;
    }
  };

  const getHumanReadableDescription = (): string => {
    const parts = [
      getPartDescription(cronParts.minute, 'minute'),
      getPartDescription(cronParts.hour, 'hour'),
      getPartDescription(cronParts.day, 'day'),
      getPartDescription(cronParts.month, 'month'),
      getPartDescription(cronParts.weekday, 'weekday')
    ];

    // Simple description logic
    return parts.join(', ');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Cron Expression Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate and parse Cron expressions, with next run time preview.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Config Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cron Expression Config */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Cron Configuration
                </CardTitle>
                <CardDescription>
                  Configure each time field
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Field Selection */}
                <div className="grid grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Minute</Label>
                    <Select value={cronParts.minute} onValueChange={(value) => updateCronPart('minute', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {minuteOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Hour</Label>
                    <Select value={cronParts.hour} onValueChange={(value) => updateCronPart('hour', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hourOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Day</Label>
                    <Select value={cronParts.day} onValueChange={(value) => updateCronPart('day', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dayOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Month</Label>
                    <Select value={cronParts.month} onValueChange={(value) => updateCronPart('month', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Weekday</Label>
                    <Select value={cronParts.weekday} onValueChange={(value) => updateCronPart('weekday', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {weekdayOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Expression Display */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Generated Cron Expression</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={cronExpression}
                      onChange={(e) => parseExpression(e.target.value)}
                      className="font-mono text-lg"
                      placeholder="* * * * *"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleCopy(cronExpression)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearAll} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Run Time Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Next Run Times
                </CardTitle>
                <CardDescription>
                  Preview of upcoming executions (based on current time)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nextRuns.map((run, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Badge variant="outline" className="w-12 h-6 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{run}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Common Patterns and Info */}
          <div className="space-y-6">
            {/* Common Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Common Patterns
                </CardTitle>
                <CardDescription>
                  Click to use preset Cron expressions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {COMMON_CRON_EXAMPLES.map((example, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => loadExample(example)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{example.name}</span>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground mb-1">
                      {Object.values(example.cron).join(' ')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {example.description}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Human Readable Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      {getHumanReadableDescription()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Field Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Field Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Syntax</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Syntax</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-3 mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">*</code>
                        <span>Any value</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">,</code>
                        <span>Value list separator</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">-</code>
                        <span>Range of values</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">/n</code>
                        <span>Step values</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-3 mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">L</code>
                        <span>Last day of month</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">W</code>
                        <span>Nearest weekday</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="font-mono bg-muted px-1 rounded">#</code>
                        <span>Nth weekday of month</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4 text-xs text-muted-foreground">
                  <p><strong>Field Order:</strong></p>
                  <p>Minute (0-59) | Hour (0-23) | Day (1-31) | Month (1-12) | Weekday (0-7)</p>
                  <p>Weekday: 0=Sun, 1=Mon, ..., 6=Sat, 7=Sun</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

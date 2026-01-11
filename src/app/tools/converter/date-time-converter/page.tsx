'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { RefreshCw, Copy, Calendar, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

interface DateTimeFormat {
  format: string;
  label: string;
  description: string;
}

interface ConversionResult {
  original: string;
  formats: { [key: string]: string };
  timezone: string;
}

export default function DateTimeConverterPage() {
  const [input, setInput] = useState('');
  const [timezone, setTimezone] = useState('Asia/Shanghai');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isValid, setIsValid] = useState(true);

  const timezones = [
    { value: 'Asia/Shanghai', label: 'Beijing Time (UTC+8)' },
    { value: 'Asia/Tokyo', label: 'Tokyo Time (UTC+9)' },
    { value: 'Asia/Seoul', label: 'Seoul Time (UTC+9)' },
    { value: 'Asia/Singapore', label: 'Singapore Time (UTC+8)' },
    { value: 'Asia/Dubai', label: 'Dubai Time (UTC+4)' },
    { value: 'Europe/London', label: 'London Time (UTC+0/+1)' },
    { value: 'Europe/Paris', label: 'Paris Time (UTC+1/+2)' },
    { value: 'Europe/Berlin', label: 'Berlin Time (UTC+1/+2)' },
    { value: 'America/New_York', label: 'New York Time (UTC-5/-4)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles Time (UTC-8/-7)' },
    { value: 'America/Chicago', label: 'Chicago Time (UTC-6/-5)' },
    { value: 'Australia/Sydney', label: 'Sydney Time (UTC+10/+11)' },
  ];

  const dateTimeFormats: DateTimeFormat[] = useMemo(() => [
    {
      format: 'YYYY-MM-DD HH:mm:ss',
      label: 'Standard',
      description: '2024-01-15 14:30:25'
    },
    {
      format: 'YYYY/MM/DD HH:mm',
      label: 'Slash Separated',
      description: '2024/01/15 14:30'
    },
    {
      format: 'DD/MM/YYYY HH:mm',
      label: 'DD/MM/YYYY',
      description: '15/01/2024 14:30'
    },
    {
      format: 'MM-DD-YYYY HH:mm:ss',
      label: 'American',
      description: '01-15-2024 14:30:25'
    },
    {
      format: 'MMMM D, YYYY HH:mm',
      label: 'Full Date',
      description: 'January 15, 2024 14:30'
    },
    {
      format: 'ddd, MMM DD, YYYY HH:mm',
      label: 'Full Date Time',
      description: 'Mon, Jan 15, 2024 14:30'
    },
    {
      format: 'YYYY-MM-DDTHH:mm:ssZ',
      label: 'ISO 8601',
      description: '2024-01-15T14:30:25+08:00'
    },
    {
      format: 'x',
      label: 'Unix Timestamp',
      description: '1705318225000'
    },
    {
      format: 'YYYY-MM-DD',
      label: 'Date Only',
      description: '2024-01-15'
    },
    {
      format: 'HH:mm:ss',
      label: 'Time Only',
      description: '14:30:25'
    },
    {
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
      label: 'With Milliseconds',
      description: '2024-01-15 14:30:25.123'
    },
    {
      format: 'YYYY[W]WW',
      label: 'Week Number',
      description: '2024W03'
    },
    {
      format: 'YYYY-DDD',
      label: 'Day of Year',
      description: '2024-015'
    },
  ], []);

  const parseDateTime = (inputStr: string, tz: string): dayjs.Dayjs | null => {
    if (!inputStr.trim()) return null;

    // Try multiple formats
    const formats = [
      'YYYY-MM-DD HH:mm:ss',
      'YYYY/MM/DD HH:mm:ss',
      'DD/MM/YYYY HH:mm:ss',
      'MM-DD-YYYY HH:mm:ss',
      'YYYY-MM-DD HH:mm',
      'YYYY/MM/DD HH:mm',
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      'DD/MM/YYYY',
      'YYYY/MM/DD',
      'MM-DD-YYYY',
      'x', // Unix timestamp
      'YYYY-MM-DDTHH:mm:ssZ',
      'YYYY-MM-DDTHH:mm:ss.SSSZ',
    ];

    for (const format of formats) {
      const parsed = dayjs(inputStr, format);
      if (parsed.isValid()) {
        return parsed.tz(tz);
      }
    }

    // Try parsing number as timestamp
    const num = parseInt(inputStr, 10);
    if (!isNaN(num) && num > 0) {
      const timestamp = num.toString().length === 10 ? num * 1000 : num;
      return dayjs(timestamp).tz(tz);
    }

    return null;
  };

  const convertDateTime = useCallback(() => {
    const parsed = parseDateTime(input, timezone);

    if (parsed) {
      const formats: { [key: string]: string } = {};

      dateTimeFormats.forEach(({ format, label }) => {
        if (format === 'x') {
          formats[label] = parsed.valueOf().toString();
        } else {
          formats[label] = parsed.format(format);
        }
      });

      setResult({
        original: input,
        formats,
        timezone
      });
      setIsValid(true);
    } else {
      setResult(null);
      setIsValid(false);
    }
  }, [input, timezone, dateTimeFormats]);

  useEffect(() => {
    convertDateTime();
  }, [input, timezone, convertDateTime]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const setCurrentTime = () => {
    const now = dayjs().tz(timezone);
    setInput(now.format('YYYY-MM-DD HH:mm:ss'));
  };

  const getRelativeTime = (date: dayjs.Dayjs): string => {
    const now = dayjs();
    return date.from(now);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Date Time Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert between different date time formats, supporting timezones and multiple formats.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Input Configuration
              </CardTitle>
              <CardDescription>
                Enter date time and select timezone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timezone Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Time Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date Time</Label>
                <Input
                  placeholder="e.g. 2024-01-15 14:30:25"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={`font-mono ${!isValid && input ? 'border-destructive' : ''}`}
                />
                {!isValid && input && (
                  <p className="text-xs text-destructive">
                    Invalid date time format, please check input
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Actions</Label>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={setCurrentTime} size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Current Time
                  </Button>
                  <Button variant="outline" onClick={handleClear} size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Supported Formats */}
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium text-sm mb-2">Supported Formats</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• 2024-01-15 14:30:25</div>
                  <div>• 2024/01/15 14:30:25</div>
                  <div>• 01/15/2024 14:30:25</div>
                  <div>• Unix Timestamp: 1705318225</div>
                  <div>• ISO 8601: 2024-01-15T14:30:25+08:00</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Result */}
          <div className="lg:col-span-2 space-y-4">
            {result ? (
              <>
                {/* Common Formats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Common Formats</CardTitle>
                    <CardDescription>
                      Most common date time formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dateTimeFormats.slice(0, 6).map(({ label, description }) => (
                        <div key={label} className="group p-3 bg-muted rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              {label}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(result.formats[label])}
                              className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="font-mono text-sm break-all">
                            {result.formats[label]}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Formats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Formats</CardTitle>
                    <CardDescription>
                      Formats used in development
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dateTimeFormats.slice(6).map(({ label, description }) => (
                        <div key={label} className="group p-3 bg-muted rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              {label}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(result.formats[label])}
                              className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="font-mono text-sm break-all">
                            {result.formats[label]}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-3 bg-muted rounded-md">
                        <div className="font-medium">Day of Week</div>
                        <div className="text-lg">
                          {parseDateTime(input, timezone)?.format('dddd')}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-md">
                        <div className="font-medium">Week Number</div>
                        <div className="text-lg">
                          {parseDateTime(input, timezone)?.format('WW')}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-md">
                        <div className="font-medium">Day of Year</div>
                        <div className="text-lg">
                          {parseDateTime(input, timezone)?.format('DDDD')}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-md">
                        <div className="font-medium">Relative Time</div>
                        <div className="text-lg">
                          {getRelativeTime(parseDateTime(input, timezone) || dayjs())}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    <div className="text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Result will be displayed after inputting date time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Timezone Conversion */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Timezone Conversion</CardTitle>
              <CardDescription>
                View current time in different timezones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {timezones.map((tz) => {
                  const timeInZone = parseDateTime(input, timezone)?.tz(tz.value);
                  return (
                    <div key={tz.value} className="p-3 bg-muted rounded-md text-center">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        {tz.label.split('(')[0].trim()}
                      </div>
                      <div className="font-mono text-sm">
                        {timeInZone?.format('HH:mm:ss')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {timeInZone?.format('MM-DD')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

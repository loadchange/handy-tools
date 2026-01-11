'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Label } from '@/components/ui';
import { Mail, CheckCircle, XCircle, Copy, RefreshCw, Settings, AlertTriangle } from 'lucide-react';

interface NormalizedEmail {
  original: string;
  normalized: string;
  domain: string;
  localPart: string;
  isValid: boolean;
  isDisposable: boolean;
  isFreeProvider: boolean;
  suggestions: string[];
}

interface BatchResult {
  total: number;
  valid: number;
  invalid: number;
  normalized: string[];
}

const FREE_EMAIL_PROVIDERS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
  'live.com', 'aol.com', 'icloud.com', 'protonmail.com', 'tutanota.com',
  'mail.com', 'gmx.com', 'zoho.com', 'yandex.com', 'qq.com', '163.com',
  '126.com', 'sina.com', 'sohu.com'
];

const DISPOSABLE_DOMAINS = [
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'yopmail.com', 'temp-mail.org', 'maildrop.cc',
  '10minutemail.net', 'temp-mail.com', 'fakemailgenerator.com'
];

const COMMON_TYPOS = [
  { wrong: 'gamil.com', correct: 'gmail.com' },
  { wrong: 'gmial.com', correct: 'gmail.com' },
  { wrong: 'gnail.com', correct: 'gmail.com' },
  { wrong: 'yahooo.com', correct: 'yahoo.com' },
  { wrong: 'yaho.com', correct: 'yahoo.com' },
  { wrong: 'hotmial.com', correct: 'hotmail.com' },
  { wrong: 'hotmai.com', correct: 'hotmail.com' },
  { wrong: 'outlok.com', correct: 'outlook.com' },
  { wrong: 'outloo.com', correct: 'outlook.com' },
  { wrong: 'gogle.com', correct: 'google.com' },
];

export default function EmailNormalizerPage() {
  const [emailInput, setEmailInput] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [activeTab, setActiveTab] = useState('single');
  const [normalizedEmail, setNormalizedEmail] = useState<NormalizedEmail | null>(null);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [removePeriods, setRemovePeriods] = useState(true);
  const [removePlus, setRemovePlus] = useState(true);
  const [lowercase, setLowercase] = useState(true);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isDisposableEmail = (domain: string): boolean => {
    return DISPOSABLE_DOMAINS.includes(domain.toLowerCase());
  };

  const isFreeProvider = (domain: string): boolean => {
    return FREE_EMAIL_PROVIDERS.includes(domain.toLowerCase());
  };

  const findSuggestions = (email: string): string[] => {
    const suggestions: string[] = [];
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) return suggestions;

    for (const typo of COMMON_TYPOS) {
      if (domain.includes(typo.wrong)) {
        const correctedEmail = email.replace(typo.wrong, typo.correct);
        suggestions.push(correctedEmail);
      }
    }

    return suggestions;
  };

  const normalizeEmail = useCallback((email: string): NormalizedEmail => {
    const trimmedEmail = email.trim();
    const isValid = validateEmail(trimmedEmail);

    if (!isValid) {
      return {
        original: email,
        normalized: trimmedEmail,
        domain: '',
        localPart: '',
        isValid: false,
        isDisposable: false,
        isFreeProvider: false,
        suggestions: []
      };
    }

    const [localPart, domain] = trimmedEmail.split('@');
    let normalizedLocalPart = localPart;
    let normalizedDomain = domain.toLowerCase();

    // Handle Gmail
    if (normalizedDomain === 'gmail.com' || normalizedDomain === 'googlemail.com') {
      normalizedDomain = 'gmail.com';

      if (removePeriods) {
        normalizedLocalPart = normalizedLocalPart.replace(/\./g, '');
      }

      if (removePlus) {
        const plusIndex = normalizedLocalPart.indexOf('+');
        if (plusIndex > 0) {
          normalizedLocalPart = normalizedLocalPart.substring(0, plusIndex);
        }
      }
    }

    // Handle other providers
    const otherProviders = ['yahoo.com', 'outlook.com', 'hotmail.com', 'live.com'];
    if (otherProviders.includes(normalizedDomain) && removePeriods) {
      normalizedLocalPart = normalizedLocalPart.replace(/\./g, '');
    }

    if (lowercase) {
      normalizedLocalPart = normalizedLocalPart.toLowerCase();
    }

    const normalizedEmail = `${normalizedLocalPart}@${normalizedDomain}`;
    const suggestions = findSuggestions(trimmedEmail);

    return {
      original: email,
      normalized: normalizedEmail,
      domain: normalizedDomain,
      localPart: normalizedLocalPart,
      isValid: true,
      isDisposable: isDisposableEmail(normalizedDomain),
      isFreeProvider: isFreeProvider(normalizedDomain),
      suggestions
    };
  }, [removePeriods, removePlus, lowercase]);

  const normalizeBatchEmails = useCallback((emails: string[]): BatchResult => {
    const normalizedEmails: string[] = [];
    let valid = 0;
    let invalid = 0;

    for (const email of emails) {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) continue;

      const result = normalizeEmail(trimmedEmail);
      if (result.isValid) {
        normalizedEmails.push(result.normalized);
        valid++;
      } else {
        invalid++;
      }
    }

    return {
      total: emails.filter(e => e.trim()).length,
      valid,
      invalid,
      normalized: normalizedEmails
    };
  }, [normalizeEmail]);

  useEffect(() => {
    if (activeTab === 'single' && emailInput) {
      setNormalizedEmail(normalizeEmail(emailInput));
    } else if (activeTab === 'batch' && batchInput) {
      const emails = batchInput.split('\n').filter(e => e.trim());
      setBatchResult(normalizeBatchEmails(emails));
    }
  }, [emailInput, batchInput, activeTab, normalizeEmail, normalizeBatchEmails]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const handleClear = () => {
    setEmailInput('');
    setBatchInput('');
    setNormalizedEmail(null);
    setBatchResult(null);
  };

  const loadSampleEmails = () => {
    setEmailInput('John.Doe+Test@GMAIL.COM');
  };

  const loadBatchSample = () => {
    setBatchInput(`John.Doe+test@gmail.com
  jane.smith@yahoo.com
  invalid-email
  user@hotmial.com
  admin@company.com
  test@10minutemail.com
  mary.johnson@outlook.com`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Email Normalizer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Normalize email addresses, detect invalid emails, provide format suggestions, and support batch processing.
          </p>
        </div>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Normalization Options
            </CardTitle>
            <CardDescription>
              Configure email normalization rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="removePeriods" className="text-sm cursor-pointer">
                  Remove Dots (Gmail etc.)
                </Label>
                <Switch
                  id="removePeriods"
                  checked={removePeriods}
                  onCheckedChange={setRemovePeriods}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="removePlus" className="text-sm cursor-pointer">
                  Remove + Tag Content
                </Label>
                <Switch
                  id="removePlus"
                  checked={removePlus}
                  onCheckedChange={setRemovePlus}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase" className="text-sm cursor-pointer">
                  Convert to Lowercase
                </Label>
                <Switch
                  id="lowercase"
                  checked={lowercase}
                  onCheckedChange={setLowercase}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Single Email
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Batch Processing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Normalization
                </CardTitle>
                <CardDescription>
                  Enter email for normalization and validation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter email, e.g.: John.Doe+test@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="font-mono"
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={loadSampleEmails} className="flex-1">
                    Load Sample
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {/* Status */}
                {normalizedEmail && (
                  <div className={`p-3 rounded-md ${
                    normalizedEmail.isValid
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {normalizedEmail.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        normalizedEmail.isValid ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {normalizedEmail.isValid ? 'Valid Email Format' : 'Invalid Email Format'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Result */}
            {normalizedEmail && normalizedEmail.isValid && (
              <Card>
                <CardHeader>
                  <CardTitle>Normalization Result</CardTitle>
                  <CardDescription>
                    Detailed analysis and normalization result
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Original Email</Label>
                        <div className="font-mono text-sm mt-1">{normalizedEmail.original}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Normalized Email</Label>
                        <div className="font-mono text-sm mt-1 p-2 bg-muted rounded">
                          {normalizedEmail.normalized}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(normalizedEmail.normalized)}
                          className="mt-2"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Normalized Email
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Local Part</Label>
                        <div className="font-mono text-sm mt-1">{normalizedEmail.localPart}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Domain Part</Label>
                        <div className="font-mono text-sm mt-1">{normalizedEmail.domain}</div>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2">
                    {normalizedEmail.isFreeProvider && (
                      <Badge variant="secondary">Free Provider</Badge>
                    )}
                    {normalizedEmail.isDisposable && (
                      <Badge variant="destructive">Disposable Email</Badge>
                    )}
                  </div>

                  {/* Suggestions */}
                  {normalizedEmail.suggestions.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Possible Correct Email</Label>
                      <div className="space-y-2">
                        {normalizedEmail.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded">
                            <span className="font-mono text-sm">{suggestion}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEmailInput(suggestion)}
                            >
                              Use This Email
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="batch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Batch Email Normalization
                </CardTitle>
                <CardDescription>
                  Enter multiple emails (one per line) for batch processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter emails, one per line:&#10;user1@gmail.com&#10;user2@yahoo.com&#10;..."
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={loadBatchSample} className="flex-1">
                    Load Sample
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {/* Batch Stats */}
                {batchResult && (
                  <div className="p-4 bg-muted rounded-md">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{batchResult.total}</div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{batchResult.valid}</div>
                        <div className="text-sm text-muted-foreground">Valid</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{batchResult.invalid}</div>
                        <div className="text-sm text-muted-foreground">Invalid</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Batch Result */}
            {batchResult && batchResult.normalized.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Normalization Result</CardTitle>
                  <CardDescription>
                    {batchResult.normalized.length} normalized email addresses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-md">
                    <pre className="text-xs font-mono overflow-x-auto">
                      {batchResult.normalized.join('\n')}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopy(batchResult.normalized.join('\n'))}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All Emails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Email Normalization Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">What is Email Normalization?</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Unified Format</strong>: Ensure consistent format</div>
                  <div>• <strong>Remove Redundancy</strong>: Remove chars not affecting delivery</div>
                  <div>• <strong>Improve Accuracy</strong>: Reduce duplicate emails</div>
                  <div>• <strong>Batch Processing</strong>: Support large scale processing</div>
                  <div>• <strong>Validation</strong>: Identify invalid/disposable emails</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Common Normalization Rules</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Gmail</strong>: Remove dots and content after +</div>
                  <div>• <strong>Outlook</strong>: Remove dots</div>
                  <div>• <strong>Yahoo</strong>: Remove dots</div>
                  <div>• <strong>Case</strong>: Convert domain/user to lowercase</div>
                  <div>• <strong>Spaces</strong>: Remove leading/trailing spaces</div>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-3 text-sm">Normalization Examples</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">Gmail Address:</p>
                  <pre className="bg-background p-2 rounded">
{`John.Doe+Newsletter@gmail.com
→ johndoe@gmail.com`}</pre>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Outlook Address:</p>
                  <pre className="bg-background p-2 rounded">
{`Jane.Smith@OUTLOOK.COM
→ janesmith@outlook.com`}</pre>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-medium text-orange-900">Notes</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Normalization might affect delivery rules for some systems</li>
                    <li>• Test normalized emails in critical apps</li>
                    <li>• Disposable emails not suitable for important registrations</li>
                    <li>• Some corporate emails may have special rules</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

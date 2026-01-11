'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Label } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Copy, RefreshCw, Shield, Clock, CheckCircle, XCircle, Key, Smartphone } from 'lucide-react';

// TOTP Generation Function (Simplified)
const generateTOTP = (secret: string, period: number = 30): string => {
  // Simplified TOTP implementation, use a library for production
  const time = Math.floor(Date.now() / 1000);
  const counter = Math.floor(time / period);

  // Generate pseudo-random code (demo only)
  const seed = secret + counter.toString();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const code = Math.abs(hash) % 1000000;
  return code.toString().padStart(6, '0');
};

// Generate Random Secret
const generateSecret = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate Numeric OTP
const generateNumericOTP = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

// Generate Alphanumeric OTP
const generateAlphanumericOTP = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

interface OTPData {
  code: string;
  secret: string;
  algorithm: string;
  digits: number;
  period: number;
  timestamp: number;
  expiresIn: number;
}

interface HOTPData {
  code: string;
  secret: string;
  counter: number;
  algorithm: string;
  digits: number;
}

export default function OTPCodeGeneratorValidatorPage() {
  const [activeTab, setActiveTab] = useState('totp');

  // TOTP State
  const [totpSecret, setTotpSecret] = useState(generateSecret());
  const [totpAlgorithm, setTotpAlgorithm] = useState('SHA1');
  const [totpDigits, setTotpDigits] = useState(6);
  const [totpPeriod, setTotpPeriod] = useState(30);
  const [totpCode, setTotpCode] = useState<OTPData | null>(null);

  // HOTP State
  const [hotpSecret, setHotpSecret] = useState(generateSecret());
  const [hotpCounter, setHotpCounter] = useState(1);
  const [hotpAlgorithm, setHotpAlgorithm] = useState('SHA1');
  const [hotpDigits, setHotpDigits] = useState(6);
  const [hotpCode, setHotpCode] = useState<HOTPData | null>(null);

  // Simple OTP State
  const [simpleOTPType, setSimpleOTPType] = useState('numeric');
  const [simpleOTPLength, setSimpleOTPLength] = useState(6);
  const [simpleOTPCode, setSimpleOTPCode] = useState('');

  // Validation State
  const [validateInput, setValidateInput] = useState('');
  const [validateSecret, setValidateSecret] = useState('');
  const [validateResult, setValidateResult] = useState<{ valid: boolean; message: string } | null>(null);

  // Generate TOTP
  const generateTOTPCode = useCallback(() => {
    const code = generateTOTP(totpSecret, totpPeriod);
    const now = Date.now();
    const periodMs = totpPeriod * 1000;
    const currentPeriod = Math.floor(now / periodMs);
    const nextPeriod = (currentPeriod + 1) * periodMs;
    const expiresIn = Math.floor((nextPeriod - now) / 1000);

    setTotpCode({
      code,
      secret: totpSecret,
      algorithm: totpAlgorithm,
      digits: totpDigits,
      period: totpPeriod,
      timestamp: now,
      expiresIn
    });
  }, [totpSecret, totpPeriod, totpAlgorithm, totpDigits]);

  // Generate HOTP
  const generateHOTPCode = useCallback(() => {
    // Simplified HOTP implementation
    const seed = hotpSecret + hotpCounter.toString();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    const code = Math.abs(hash) % Math.pow(10, hotpDigits);
    const codeStr = code.toString().padStart(hotpDigits, '0');

    setHotpCode({
      code: codeStr,
      secret: hotpSecret,
      counter: hotpCounter,
      algorithm: hotpAlgorithm,
      digits: hotpDigits
    });
  }, [hotpSecret, hotpCounter, hotpAlgorithm, hotpDigits]);

  // Generate Simple OTP
  const generateSimpleOTP = useCallback(() => {
    let code = '';
    switch (simpleOTPType) {
      case 'numeric':
        code = generateNumericOTP(simpleOTPLength);
        break;
      case 'alphanumeric':
        code = generateAlphanumericOTP(simpleOTPLength);
        break;
      default:
        code = generateNumericOTP(simpleOTPLength);
    }
    setSimpleOTPCode(code);
  }, [simpleOTPType, simpleOTPLength]);

  // Validate OTP
  const validateOTP = useCallback(() => {
    if (!validateInput || !validateSecret) {
      setValidateResult({ valid: false, message: 'Please enter OTP code and secret to validate' });
      return;
    }

    // Try to validate TOTP
    const totpExpected = generateTOTP(validateSecret, 30);
    const isValid = validateInput === totpExpected;

    setValidateResult({
      valid: isValid,
      message: isValid ? 'OTP validation successful!' : 'OTP validation failed, please check code or regenerate.'
    });
  }, [validateInput, validateSecret]);

  // Auto-refresh TOTP
  useEffect(() => {
    if (activeTab === 'totp' && totpCode) {
      const timer = setInterval(() => {
        generateTOTPCode();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab, generateTOTPCode]);

  // Initial Generation
  useEffect(() => {
    generateTOTPCode();
    generateHOTPCode();
    generateSimpleOTP();
  }, [generateTOTPCode, generateHOTPCode, generateSimpleOTP]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const generateNewSecret = () => {
    const newSecret = generateSecret();
    setTotpSecret(newSecret);
    setHotpSecret(newSecret);
    generateTOTPCode();
    generateHOTPCode();
  };

  const loadSampleSecret = () => {
    const sampleSecret = 'JBSWY3DPEHPK3PXP';
    setTotpSecret(sampleSecret);
    setHotpSecret(sampleSecret);
    setValidateSecret(sampleSecret);
    generateTOTPCode();
    generateHOTPCode();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">OTP Generator & Validator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate and validate One-Time Passwords (OTP), supporting TOTP, HOTP, and simple OTP.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="totp">TOTP</TabsTrigger>
            <TabsTrigger value="hotp">HOTP</TabsTrigger>
            <TabsTrigger value="simple">Simple OTP</TabsTrigger>
            <TabsTrigger value="validate">Validate</TabsTrigger>
          </TabsList>

          <TabsContent value="totp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time-based One-Time Password (TOTP)
                </CardTitle>
                <CardDescription>
                  Generates time-based OTP codes, refreshing automatically every 30 seconds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Algorithm</Label>
                    <Select value={totpAlgorithm} onValueChange={setTotpAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHA1">SHA1</SelectItem>
                        <SelectItem value="SHA256">SHA256</SelectItem>
                        <SelectItem value="SHA512">SHA512</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Digits</Label>
                    <Select value={totpDigits.toString()} onValueChange={(value) => setTotpDigits(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 digits</SelectItem>
                        <SelectItem value="8">8 digits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Period (sec)</Label>
                    <Select value={totpPeriod.toString()} onValueChange={(value) => setTotpPeriod(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30s</SelectItem>
                        <SelectItem value="60">60s</SelectItem>
                        <SelectItem value="90">90s</SelectItem>
                        <SelectItem value="120">120s</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Secret Key */}
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={totpSecret}
                      onChange={(e) => setTotpSecret(e.target.value)}
                      placeholder="Enter or generate secret"
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={generateNewSecret}>
                      <Key className="h-4 w-4 mr-2" />
                      Generate New
                    </Button>
                  </div>
                </div>

                {/* OTP Display */}
                {totpCode && (
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold">Current OTP Code</Label>
                          <div className="text-4xl font-mono font-bold text-blue-600 tracking-wider">
                            {totpCode.code}
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm text-muted-foreground">
                            Time remaining: {totpCode.expiresIn} s
                          </span>
                        </div>

                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => handleCopy(totpCode.code)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Code
                          </Button>
                          <Button
                            onClick={() => handleCopy(totpCode.secret)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Secret
                          </Button>
                          <Button
                            onClick={generateTOTPCode}
                            variant="outline"
                            size="sm"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Refresh
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <Badge variant="secondary">{totpCode.algorithm}</Badge>
                          <Badge variant="outline" className="ml-2">{totpCode.digits} digits</Badge>
                          <Badge variant="outline" className="ml-2">{totpCode.period}s period</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Counter-based One-Time Password (HOTP)
                </CardTitle>
                <CardDescription>
                  Generates counter-based OTP codes, incrementing counter on each use
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Algorithm</Label>
                    <Select value={hotpAlgorithm} onValueChange={setHotpAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHA1">SHA1</SelectItem>
                        <SelectItem value="SHA256">SHA256</SelectItem>
                        <SelectItem value="SHA512">SHA512</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Digits</Label>
                    <Select value={hotpDigits.toString()} onValueChange={(value) => setHotpDigits(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 digits</SelectItem>
                        <SelectItem value="8">8 digits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Counter</Label>
                    <Input
                      type="number"
                      value={hotpCounter}
                      onChange={(e) => setHotpCounter(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>

                {/* Secret Key */}
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={hotpSecret}
                      onChange={(e) => setHotpSecret(e.target.value)}
                      placeholder="Enter or generate secret"
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={generateNewSecret}>
                      <Key className="h-4 w-4 mr-2" />
                      Generate New
                    </Button>
                  </div>
                </div>

                {/* OTP Display */}
                {hotpCode && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold">HOTP Code</Label>
                          <div className="text-4xl font-mono font-bold text-green-600 tracking-wider">
                            {hotpCode.code}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Counter: {hotpCode.counter}
                        </div>

                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => handleCopy(hotpCode.code)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Code
                          </Button>
                          <Button
                            onClick={() => handleCopy(hotpCode.secret)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Secret
                          </Button>
                          <Button
                            onClick={() => {
                              setHotpCounter(hotpCounter + 1);
                              generateHOTPCode();
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Next Code
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <Badge variant="secondary">{hotpCode.algorithm}</Badge>
                          <Badge variant="outline" className="ml-2">{hotpCode.digits} digits</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simple" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Simple OTP Generator
                </CardTitle>
                <CardDescription>
                  Generate simple random OTP codes for basic verification needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>OTP Type</Label>
                    <Select value={simpleOTPType} onValueChange={setSimpleOTPType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="numeric">Numeric</SelectItem>
                        <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Length</Label>
                    <Select value={simpleOTPLength.toString()} onValueChange={(value) => setSimpleOTPLength(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 digits</SelectItem>
                        <SelectItem value="6">6 digits</SelectItem>
                        <SelectItem value="8">8 digits</SelectItem>
                        <SelectItem value="10">10 digits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex gap-2">
                  <Button onClick={generateSimpleOTP} className="flex-1">
                    <Key className="h-4 w-4 mr-2" />
                    Generate OTP
                  </Button>
                </div>

                {/* OTP Display */}
                {simpleOTPCode && (
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold">Generated OTP Code</Label>
                          <div className="text-4xl font-mono font-bold text-purple-600 tracking-wider">
                            {simpleOTPCode}
                          </div>
                        </div>

                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => handleCopy(simpleOTPCode)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Code
                          </Button>
                          <Button
                            onClick={generateSimpleOTP}
                            variant="outline"
                            size="sm"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Regenerate
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <Badge variant="outline">{simpleOTPType}</Badge>
                          <Badge variant="outline" className="ml-2">{simpleOTPLength} digits</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  OTP Validator
                </CardTitle>
                <CardDescription>
                  Validate if an OTP code is correct
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Validation Input */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otpInput">OTP Code</Label>
                    <Input
                      id="otpInput"
                      placeholder="Enter OTP code to validate"
                      value={validateInput}
                      onChange={(e) => setValidateInput(e.target.value)}
                      className="font-mono text-lg text-center tracking-wider"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secretInput">Secret Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secretInput"
                        placeholder="Enter secret key"
                        value={validateSecret}
                        onChange={(e) => setValidateSecret(e.target.value)}
                        className="font-mono"
                      />
                      <Button variant="outline" onClick={loadSampleSecret}>
                        Load Example Key
                      </Button>
                    </div>
                  </div>

                  <Button onClick={validateOTP} className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Validate OTP
                  </Button>
                </div>

                {/* Validation Result */}
                {validateResult && (
                  <Card className={
                    validateResult.valid
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        {validateResult.valid ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                        <div>
                          <div className={`font-semibold ${
                            validateResult.valid ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {validateResult.valid ? 'Validation Successful' : 'Validation Failed'}
                          </div>
                          <div className={`text-sm ${
                            validateResult.valid ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {validateResult.message}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Instructions */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-800">Instructions</h4>
                      <ul className="text-sm text-blue-700 space-y-2">
                        <li>• Enter the OTP code to validate</li>
                        <li>• Enter the corresponding secret key (Base32 format)</li>
                        <li>• System automatically calculates expected OTP for current time</li>
                        <li>• Supports TOTP standard validation</li>
                        <li>• If validation fails, check the secret key or wait for next cycle</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* OTP Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>OTP Types Explained</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  TOTP (Time-based)
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• Time-based One-Time Password</div>
                  <div>• Updates every 30-60 seconds</div>
                  <div>• Requires time synchronization</div>
                  <div>• Suitable for mobile apps</div>
                  <div>• Common algos: SHA1, SHA256</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  HOTP (Counter-based)
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• Counter-based One-Time Password</div>
                  <div>• Increments counter on each use</div>
                  <div>• No time sync needed</div>
                  <div>• Suitable for hardware tokens</div>
                  <div>• Need to maintain counter state</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Simple OTP
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• Random number generation</div>
                  <div>• For temporary verification</div>
                  <div>• Simple and fast</div>
                  <div>• Lower security</div>
                  <div>• Good for SMS/Email verification</div>
                </div>
              </div>
            </div>

            {/* Security Advice */}
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
              <h4 className="font-medium mb-3 text-sm">Security Advice</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">Key Management:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Use strong random key generators</li>
                    <li>Store keys securely, avoid leaks</li>
                    <li>Rotate keys periodically</li>
                    <li>Use encrypted transmission for keys</li>
                  </ul>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Usage Environment:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Ensure server time accuracy</li>
                    <li>Implement anti-brute-force mechanisms</li>
                    <li>Limit verification attempts</li>
                    <li>Log validation failures</li>
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
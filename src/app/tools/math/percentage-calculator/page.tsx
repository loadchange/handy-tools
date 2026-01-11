'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Label } from '@/components/ui';
import { Badge } from '@/components/ui';
import {
  Calculator,
  Percent,
  TrendingUp,
  TrendingDown,
  Copy,
  RefreshCw,
  Minus
} from 'lucide-react';

interface CalculationResult {
  result: number;
  formula: string;
  description: string;
}

const COMMON_PERCENTAGES = [5, 10, 15, 20, 25, 30, 50, 75, 100, 200];

export default function PercentageCalculatorPage() {
  const [activeTab, setActiveTab] = useState('basic');

  // Basic Percentage Calculation
  const [percentage, setPercentage] = useState('20');
  const [baseValue, setBaseValue] = useState('100');
  const [basicResult, setBasicResult] = useState<CalculationResult | null>(null);

  // Percentage Increase Calculation
  const [originalValue, setOriginalValue] = useState('100');
  const [percentageChange, setPercentageChange] = useState('25');
  const [growthResult, setGrowthResult] = useState<CalculationResult | null>(null);

  // Percentage Decrease Calculation
  const [reduceOriginalValue, setReduceOriginalValue] = useState('100');
  const [percentageDecrease, setPercentageDecrease] = useState('25');
  const [decreaseResult, setDecreaseResult] = useState<CalculationResult | null>(null);

  // Percentage Difference Calculation
  const [valueA, setValueA] = useState('120');
  const [valueB, setValueB] = useState('100');
  const [differenceResult, setDifferenceResult] = useState<CalculationResult | null>(null);

  const calculateBasicPercentage = useCallback(() => {
    const percent = parseFloat(percentage) || 0;
    const base = parseFloat(baseValue) || 0;
    const result = (base * percent) / 100;

    setBasicResult({
      result,
      formula: `${base} × ${percent}% = ${result}`,
      description: `${percent}% of ${base} is ${result}`
    });
  }, [percentage, baseValue]);

  const calculateGrowth = useCallback(() => {
    const original = parseFloat(originalValue) || 0;
    const percent = parseFloat(percentageChange) || 0;
    const result = original * (1 + percent / 100);

    setGrowthResult({
      result,
      formula: `${original} × (1 + ${percent}%) = ${result}`,
      description: `${original} increased by ${percent}% is ${result}`
    });
  }, [originalValue, percentageChange]);

  const calculateDecrease = useCallback(() => {
    const original = parseFloat(reduceOriginalValue) || 0;
    const percent = parseFloat(percentageDecrease) || 0;
    const result = original * (1 - percent / 100);

    setDecreaseResult({
      result,
      formula: `${original} × (1 - ${percent}%) = ${result}`,
      description: `${original} decreased by ${percent}% is ${result}`
    });
  }, [reduceOriginalValue, percentageDecrease]);

  const calculateDifference = useCallback(() => {
    const a = parseFloat(valueA) || 0;
    const b = parseFloat(valueB) || 0;
    const result = b !== 0 ? ((a - b) / b) * 100 : 0;

    setDifferenceResult({
      result,
      formula: `((${a} - ${b}) / ${b}) × 100 = ${result}%`,
      description: `Percentage of ${a} relative to ${b} is ${result.toFixed(2)}%`
    });
  }, [valueA, valueB]);

  useEffect(() => {
    calculateBasicPercentage();
  }, [calculateBasicPercentage]);

  useEffect(() => {
    calculateGrowth();
  }, [calculateGrowth]);

  useEffect(() => {
    calculateDecrease();
  }, [calculateDecrease]);

  useEffect(() => {
    calculateDifference();
  }, [calculateDifference]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  };

  const loadQuickExample = (percent: number) => {
    setPercentage(percent.toString());
    setPercentageChange(percent.toString());
    setPercentageDecrease(percent.toString());
  };

  const clearAll = () => {
    setPercentage('20');
    setBaseValue('100');
    setOriginalValue('100');
    setPercentageChange('25');
    setReduceOriginalValue('100');
    setPercentageDecrease('25');
    setValueA('120');
    setValueB('100');
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Percentage Calculator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Perform various percentage calculations, including basic percentage, increase, decrease, and difference.
          </p>
        </div>

        {/* Quick Percentages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Quick Percentages
            </CardTitle>
            <CardDescription>
              Select common percentages for quick calculation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {COMMON_PERCENTAGES.map((percent) => (
                <Button
                  key={percent}
                  variant="outline"
                  size="sm"
                  onClick={() => loadQuickExample(percent)}
                  className="flex items-center gap-1"
                >
                  <Percent className="h-3 w-3" />
                  {percent}%
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="growth">Increase</TabsTrigger>
            <TabsTrigger value="decrease">Decrease</TabsTrigger>
            <TabsTrigger value="difference">Difference</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Basic Percentage Calculation
                </CardTitle>
                <CardDescription>
                  Calculate the percentage of a value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="percentage">Percentage (%)</Label>
                    <Input
                      id="percentage"
                      type="number"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="Enter percentage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseValue">Base Value</Label>
                    <Input
                      id="baseValue"
                      type="number"
                      value={baseValue}
                      onChange={(e) => setBaseValue(e.target.value)}
                      placeholder="Enter base value"
                    />
                  </div>
                </div>

                {basicResult && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-primary">
                        {formatNumber(basicResult.result)}
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg text-primary/80">
                          {basicResult.description}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {basicResult.formula}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(basicResult.result.toString())}
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Result
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Percentage Increase Calculation
                </CardTitle>
                <CardDescription>
                  Calculate value after percentage increase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalValue">Original Value</Label>
                    <Input
                      id="originalValue"
                      type="number"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(e.target.value)}
                      placeholder="Enter original value"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentageChange">Increase Percentage (%)</Label>
                    <Input
                      id="percentageChange"
                      type="number"
                      value={percentageChange}
                      onChange={(e) => setPercentageChange(e.target.value)}
                      placeholder="Enter increase percentage"
                    />
                  </div>
                </div>

                {growthResult && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-primary">
                        {formatNumber(growthResult.result)}
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg text-primary/80">
                          {growthResult.description}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {growthResult.formula}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-primary/70">
                        <TrendingUp className="h-4 w-4" />
                        <span>Increase Amount: {formatNumber(growthResult.result - parseFloat(originalValue))}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(growthResult.result.toString())}
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Result
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decrease" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Percentage Decrease Calculation
                </CardTitle>
                <CardDescription>
                  Calculate value after percentage decrease
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reduceOriginalValue">Original Value</Label>
                    <Input
                      id="reduceOriginalValue"
                      type="number"
                      value={reduceOriginalValue}
                      onChange={(e) => setReduceOriginalValue(e.target.value)}
                      placeholder="Enter original value"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentageDecrease">Decrease Percentage (%)</Label>
                    <Input
                      id="percentageDecrease"
                      type="number"
                      value={percentageDecrease}
                      onChange={(e) => setPercentageDecrease(e.target.value)}
                      placeholder="Enter decrease percentage"
                    />
                  </div>
                </div>

                {decreaseResult && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-primary">
                        {formatNumber(decreaseResult.result)}
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg text-primary/80">
                          {decreaseResult.description}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {decreaseResult.formula}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-primary/70">
                        <TrendingDown className="h-4 w-4" />
                        <span>Decrease Amount: {formatNumber(parseFloat(reduceOriginalValue) - decreaseResult.result)}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(decreaseResult.result.toString())}
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Result
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="difference" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Percentage Difference Calculation
                </CardTitle>
                <CardDescription>
                  Calculate percentage difference between two values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valueA">Value A</Label>
                    <Input
                      id="valueA"
                      type="number"
                      value={valueA}
                      onChange={(e) => setValueA(e.target.value)}
                      placeholder="Enter first value"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valueB">Value B (Base)</Label>
                    <Input
                      id="valueB"
                      type="number"
                      value={valueB}
                      onChange={(e) => setValueB(e.target.value)}
                      placeholder="Enter base value"
                    />
                  </div>
                </div>

                {differenceResult && (
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-primary">
                        {differenceResult.result.toFixed(2)}%
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg text-primary/80">
                          {differenceResult.description}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {differenceResult.formula}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {differenceResult.result > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : differenceResult.result < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-600" />
                        )}
                        <Badge variant="outline">
                          {differenceResult.result > 0 ? 'Increase' :
                           differenceResult.result < 0 ? 'Decrease' : 'Same'}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCopy(differenceResult.result.toFixed(2) + '%')}
                        className="mt-2"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Result
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearAll} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Percentage Formulas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h4 className="font-medium">Basic Formula</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Calculate Percentage</strong>: Base Value × Percentage ÷ 100</div>
                  <div>• <strong>Example</strong>: 100 × 20% ÷ 100 = 20</div>
                  <div>• <strong>Application</strong>: Calculate discounts, taxes, etc.</div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Increase Formula</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Increase Percentage</strong>: Original × (1 + Increase Rate)</div>
                  <div>• <strong>Example</strong>: 100 × (1 + 25%) = 125</div>
                  <div>• <strong>Application</strong>: Calculate price hikes, investment returns</div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Decrease Formula</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Decrease Percentage</strong>: Original × (1 - Decrease Rate)</div>
                  <div>• <strong>Example</strong>: 100 × (1 - 25%) = 75</div>
                  <div>• <strong>Application</strong>: Calculate discounts, cost reductions</div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Difference Formula</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>• <strong>Percentage Difference</strong>: (New - Old) ÷ Old × 100</div>
                  <div>• <strong>Example</strong>: (120 - 100) ÷ 100 × 100 = 20%</div>
                  <div>• <strong>Application</strong>: Calculate change rate, growth rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

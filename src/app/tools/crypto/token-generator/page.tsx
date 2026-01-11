'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { ResultDisplay } from '@/components/ui';
import { Slider } from '@/components/ui';
import { Switch } from '@/components/ui';
import { RefreshCw, Copy, Settings } from 'lucide-react';

interface TokenConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const generateToken = (config: TokenConfig): string => {
  let charset = '';
  if (config.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (config.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (config.includeNumbers) charset += '0123456789';
  if (config.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (charset === '') return '';

  let result = '';
  for (let i = 0; i < config.length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

export default function TokenGeneratorPage() {
  const [config, setConfig] = useState<TokenConfig>({
    length: 32,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  });

  const [token, setToken] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewToken = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      setToken(generateToken(config));
      setIsGenerating(false);
    }, 10);
  }, [config]);

  useEffect(() => {
    generateNewToken();
  }, [generateNewToken]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token).then(() => {
      console.log('Token copied to clipboard');
    });
  };

  const handleConfigChange = (key: keyof TokenConfig, value: boolean | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Token 生成器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            生成安全的随机令牌，适用于 API 密钥、会话 ID、临时密码等场景。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 配置区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                配置选项
              </CardTitle>
              <CardDescription>
                自定义令牌的生成规则
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 长度配置 */}
              <div className="space-y-2">
                <Label>令牌长度: {config.length}</Label>
                <Slider
                  value={[config.length]}
                  onValueChange={([value]) => handleConfigChange('length', value)}
                  max={128}
                  min={8}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>8</span>
                  <span>128</span>
                </div>
              </div>

              {/* 字符类型选项 */}
              <div className="space-y-4">
                <Label>包含字符类型</Label>

                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase" className="flex-1 cursor-pointer">
                    大写字母 (A-Z)
                  </Label>
                  <Switch
                    id="uppercase"
                    checked={config.includeUppercase}
                    onCheckedChange={(checked) => handleConfigChange('includeUppercase', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase" className="flex-1 cursor-pointer">
                    小写字母 (a-z)
                  </Label>
                  <Switch
                    id="lowercase"
                    checked={config.includeLowercase}
                    onCheckedChange={(checked) => handleConfigChange('includeLowercase', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers" className="flex-1 cursor-pointer">
                    数字 (0-9)
                  </Label>
                  <Switch
                    id="numbers"
                    checked={config.includeNumbers}
                    onCheckedChange={(checked) => handleConfigChange('includeNumbers', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols" className="flex-1 cursor-pointer">
                    特殊符号 (!@#$%^&*)
                  </Label>
                  <Switch
                    id="symbols"
                    checked={config.includeSymbols}
                    onCheckedChange={(checked) => handleConfigChange('includeSymbols', checked)}
                  />
                </div>
              </div>

              {/* 快速预设 */}
              <div className="space-y-2">
                <Label>快速预设</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfig({
                      length: 32,
                      includeUppercase: true,
                      includeLowercase: true,
                      includeNumbers: true,
                      includeSymbols: false,
                    })}
                  >
                    API Key
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfig({
                      length: 64,
                      includeUppercase: true,
                      includeLowercase: true,
                      includeNumbers: true,
                      includeSymbols: true,
                    })}
                  >
                    安全 Token
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfig({
                      length: 16,
                      includeUppercase: false,
                      includeLowercase: true,
                      includeNumbers: true,
                      includeSymbols: false,
                    })}
                  >
                    简单密码
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfig({
                      length: 8,
                      includeUppercase: true,
                      includeLowercase: true,
                      includeNumbers: false,
                      includeSymbols: false,
                    })}
                  >
                    短令牌
                  </Button>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  onClick={generateNewToken}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  重新生成
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!token}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 结果区域 */}
          <ResultDisplay
            title="生成的令牌"
            result={token}
            type="text"
            showCopy={!!token}
            onCopy={handleCopy}
            placeholder="配置选项后将自动生成令牌"
          />
        </div>

        {/* 使用建议 */}
        <Card>
          <CardHeader>
            <CardTitle>使用建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">安全用途</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• API 密钥（推荐 32-64 位，包含符号）</li>
                  <li>• 会话 ID（推荐 32 位，混合字符）</li>
                  <li>• 临时密码（推荐 16-24 位）</li>
                  <li>• 重置令牌（推荐 64 位）</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">注意事项</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 令牌是随机生成的，无法反向推导</li>
                  <li>• 建议定期更换重要的令牌</li>
                  <li>• 不要在不安全的网络中传输令牌</li>
                  <li>• 重要令牌应该加密存储</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

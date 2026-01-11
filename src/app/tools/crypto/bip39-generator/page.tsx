'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Label } from '@/components/ui';
import { RefreshCw, Copy, Key, AlertTriangle, Settings } from 'lucide-react';
import { generateMnemonic } from 'bip39';

interface BIP39Result {
  mnemonic: string;
  entropy: string;
  wordCount: number;
}

export default function BIP39GeneratorPage() {
  const [wordCount, setWordCount] = useState(12);
  const [result, setResult] = useState<BIP39Result | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMnemonicWords = useCallback(() => {
    setIsGenerating(true);
    try {
      const entropyBits = wordCount * 11;
      const entropyBytes = Math.floor(entropyBits / 8);

      // 生成助记词
      const mnemonic = generateMnemonic(entropyBytes);

      // 生成对应的熵（十六进制）
      const entropy = Array.from({ length: entropyBytes }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');

      setResult({
        mnemonic,
        entropy,
        wordCount
      });
    } catch (error) {
      console.error('BIP39 generation error:', error);
      setResult({
        mnemonic: '生成失败',
        entropy: '',
        wordCount: 0
      });
    } finally {
      setIsGenerating(false);
    }
  }, [wordCount]);

  useEffect(() => {
    generateMnemonicWords();
  }, [wordCount, generateMnemonicWords]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    });
  };

  const handleClear = () => {
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">BIP39 助记词生成器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            生成符合 BIP39 标准的助记词，用于加密货币钱包的种子生成和私钥恢复。
          </p>
        </div>

        {/* 安全警告 */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-medium text-orange-900">安全警告</h3>
                <p className="text-sm text-orange-800">
                  生成的助记词是访问加密货币资产的唯一凭证。请务必在安全、离线的环境中使用，并妥善保管。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 配置区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                生成配置
              </CardTitle>
              <CardDescription>
                配置助记词生成参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 词数选择 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">助记词数量</Label>
                <Select value={wordCount.toString()} onValueChange={(value) => setWordCount(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 个词 (128 位熵)</SelectItem>
                    <SelectItem value="15">15 个词 (160 位熵)</SelectItem>
                    <SelectItem value="18">18 个词 (192 位熵)</SelectItem>
                    <SelectItem value="21">21 个词 (224 位熵)</SelectItem>
                    <SelectItem value="24">24 个词 (256 位熵)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 安全级别说明 */}
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium text-sm mb-2">安全级别</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• <strong>12 词</strong>: 基础安全，适用于小额资产</div>
                  <div>• <strong>18 词</strong>: 较高安全，推荐用于常规用途</div>
                  <div>• <strong>24 词</strong>: 最高安全，适用于大额资产</div>
                </div>
              </div>

              {/* BIP39 标准说明 */}
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium text-sm mb-2">BIP39 标准</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 使用官方 2048 个单词表</li>
                  <li>• 包含校验和确保完整性</li>
                  <li>• 广泛支持的主流钱包</li>
                  <li>• 跨平台兼容性</li>
                </ul>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  onClick={generateMnemonicWords}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <Key className="h-4 w-4 mr-2" />
                  {isGenerating ? '生成中...' : '重新生成'}
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 结果区域 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>助记词</CardTitle>
                <CardDescription>
                  {result ? `${result.wordCount} 个单词` : '生成后显示助记词'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="生成的助记词将显示在这里..."
                  value={result?.mnemonic || ''}
                  readOnly
                  className="min-h-[120px] resize-none font-mono text-sm"
                />
                {result && result.mnemonic && result.mnemonic !== '生成失败' && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      {result.wordCount} 个单词
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(result.mnemonic)}>
                      <Copy className="h-4 w-4 mr-2" />
                      复制
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>熵值</CardTitle>
                <CardDescription>
                  生成的随机熵值（十六进制）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="熵值将显示在这里..."
                  value={result?.entropy || ''}
                  readOnly
                  className="min-h-[80px] resize-none font-mono text-sm"
                />
                {result && result.entropy && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      {result.entropy.length / 2} 字节
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(result.entropy)}>
                      <Copy className="h-4 w-4 mr-2" />
                      复制
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 使用指南 */}
        <Card>
          <CardHeader>
            <CardTitle>使用指南</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-3">安全最佳实践</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>在离线环境中生成助记词</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>用笔和纸记录，避免数字化存储</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>不要截屏、拍照或存储在联网设备中</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>分多个安全地点备份</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>定期检查备份的完整性</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">兼容性说明</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>主流钱包</strong>: MetaMask, Trust Wallet, Exodus</li>
                  <li>• <strong>硬件钱包</strong>: Ledger, Trezor, Coldcard</li>
                  <li>• <strong>软件钱包</strong>: Electrum, Atomic Wallet</li>
                  <li>• <strong>支持币种</strong>: Bitcoin, Ethereum, 等多数主流币种</li>
                  <li>• <strong>衍生路径</strong>: 支持标准的 BIP44/BIP84 路径</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

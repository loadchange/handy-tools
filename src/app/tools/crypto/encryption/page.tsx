'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Label } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { RefreshCw, Copy, Lock, Unlock, AlertTriangle } from 'lucide-react';
import CryptoJS from 'crypto-js';

interface EncryptionResult {
  result: string;
  success: boolean;
  error?: string;
}

export default function EncryptionPage() {
  const [activeTab, setActiveTab] = useState('encrypt');
  const [algorithm, setAlgorithm] = useState('AES');
  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('');
  const [result, setResult] = useState<EncryptionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const encrypt = useCallback(() => {
    if (!input.trim() || !secret.trim()) {
      setResult({
        result: '',
        success: false,
        error: '请输入文本和密钥'
      });
      return;
    }

    setIsProcessing(true);
    try {
      let encrypted = '';

      switch (algorithm) {
        case 'AES':
          encrypted = CryptoJS.AES.encrypt(input, secret).toString();
          break;
        case 'DES':
          encrypted = CryptoJS.DES.encrypt(input, secret).toString();
          break;
        case 'Rabbit':
          encrypted = CryptoJS.Rabbit.encrypt(input, secret).toString();
          break;
        case 'RC4':
          encrypted = CryptoJS.RC4.encrypt(input, secret).toString();
          break;
        default:
          encrypted = CryptoJS.AES.encrypt(input, secret).toString();
      }

      setResult({
        result: encrypted,
        success: true
      });
    } catch {
      setResult({
        result: '',
        success: false,
        error: '加密失败'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, secret, algorithm]);

  const decrypt = useCallback(() => {
    if (!input.trim() || !secret.trim()) {
      setResult({
        result: '',
        success: false,
        error: '请输入加密文本和密钥'
      });
      return;
    }

    setIsProcessing(true);
    try {
      let decrypted = '';

      switch (algorithm) {
        case 'AES':
          decrypted = CryptoJS.AES.decrypt(input, secret).toString(CryptoJS.enc.Utf8);
          break;
        case 'DES':
          decrypted = CryptoJS.DES.decrypt(input, secret).toString(CryptoJS.enc.Utf8);
          break;
        case 'Rabbit':
          decrypted = CryptoJS.Rabbit.decrypt(input, secret).toString(CryptoJS.enc.Utf8);
          break;
        case 'RC4':
          decrypted = CryptoJS.RC4.decrypt(input, secret).toString(CryptoJS.enc.Utf8);
          break;
        default:
          decrypted = CryptoJS.AES.decrypt(input, secret).toString(CryptoJS.enc.Utf8);
      }

      if (!decrypted) {
        throw new Error('解密失败，可能是密钥错误或输入格式不正确');
      }

      setResult({
        result: decrypted,
        success: true
      });
    } catch {
      setResult({
        result: '',
        success: false,
        error: '解密失败，请检查密钥是否正确'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, secret, algorithm]);

  useEffect(() => {
    if (activeTab === 'encrypt' && input && secret) {
      encrypt();
    } else if (activeTab === 'decrypt' && input && secret) {
      decrypt();
    }
  }, [input, secret, algorithm, activeTab, encrypt, decrypt]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    });
  };

  const handleClear = () => {
    setInput('');
    setSecret('');
    setResult(null);
  };

  const generateSecret = () => {
    const length = 32;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let secret = '';
    for (let i = 0; i < length; i++) {
      secret += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setSecret(secret);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">文本加密解密</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            使用多种加密算法对文本进行加密和解密，保护敏感信息安全。
          </p>
        </div>

        {/* 安全警告 */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-medium text-orange-900">安全提示</h3>
                <p className="text-sm text-orange-800">
                  此工具仅用于学习和测试目的，不应在生产环境中处理敏感数据。密钥安全由用户自行负责。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              加密
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="flex items-center gap-2">
              <Unlock className="h-4 w-4" />
              解密
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 输入区域 */}
              <Card>
                <CardHeader>
                  <CardTitle>加密配置</CardTitle>
                  <CardDescription>
                    配置加密参数
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 算法选择 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">加密算法</Label>
                    <Select value={algorithm} onValueChange={setAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AES">AES (推荐)</SelectItem>
                        <SelectItem value="DES">DES</SelectItem>
                        <SelectItem value="Rabbit">Rabbit</SelectItem>
                        <SelectItem value="RC4">RC4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 原始文本 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">原始文本</Label>
                    <Textarea
                      placeholder="输入要加密的文本..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  {/* 密钥 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">密钥</Label>
                      <Button variant="outline" size="sm" onClick={generateSecret}>
                        生成密钥
                      </Button>
                    </div>
                    <Input
                      type="password"
                      placeholder="输入加密密钥..."
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                    />
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Button onClick={encrypt} disabled={isProcessing} className="flex-1">
                      <Lock className="h-4 w-4 mr-2" />
                      {isProcessing ? '加密中...' : '加密'}
                    </Button>
                    <Button variant="outline" onClick={handleClear}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      清空
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 结果区域 */}
              <Card>
                <CardHeader>
                  <CardTitle>加密结果</CardTitle>
                  <CardDescription>
                    {result?.success ? '加密成功' : '等待加密'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="加密后的文本将显示在这里..."
                    value={result?.result || ''}
                    readOnly
                    className="min-h-[200px] resize-none font-mono text-sm"
                  />
                  {result?.success && result.result && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">
                        {result.result.length} 个字符
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(result.result)}>
                        <Copy className="h-4 w-4 mr-2" />
                        复制
                      </Button>
                    </div>
                  )}
                  {result?.error && (
                    <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm text-destructive">{result.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 输入区域 */}
              <Card>
                <CardHeader>
                  <CardTitle>解密配置</CardTitle>
                  <CardDescription>
                    配置解密参数
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 算法选择 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">解密算法</Label>
                    <Select value={algorithm} onValueChange={setAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AES">AES (推荐)</SelectItem>
                        <SelectItem value="DES">DES</SelectItem>
                        <SelectItem value="Rabbit">Rabbit</SelectItem>
                        <SelectItem value="RC4">RC4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 加密文本 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">加密文本</Label>
                    <Textarea
                      placeholder="输入要解密的加密文本..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  {/* 密钥 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">密钥</Label>
                    <Input
                      type="password"
                      placeholder="输入解密密钥..."
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                    />
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Button onClick={decrypt} disabled={isProcessing} className="flex-1">
                      <Unlock className="h-4 w-4 mr-2" />
                      {isProcessing ? '解密中...' : '解密'}
                    </Button>
                    <Button variant="outline" onClick={handleClear}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      清空
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 结果区域 */}
              <Card>
                <CardHeader>
                  <CardTitle>解密结果</CardTitle>
                  <CardDescription>
                    {result?.success ? '解密成功' : '等待解密'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="解密后的文本将显示在这里..."
                    value={result?.result || ''}
                    readOnly
                    className="min-h-[200px] resize-none"
                  />
                  {result?.success && result.result && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">
                        {result.result.length} 个字符
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(result.result)}>
                        <Copy className="h-4 w-4 mr-2" />
                        复制
                      </Button>
                    </div>
                  )}
                  {result?.error && (
                    <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm text-destructive">{result.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 算法说明 */}
        <Card>
          <CardHeader>
            <CardTitle>加密算法说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-3">算法特性</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>
                    <strong>AES (Advanced Encryption Standard)</strong>
                    <p className="text-xs mt-1">对称加密，美国政府标准，安全性高</p>
                  </div>
                  <div>
                    <strong>DES (Data Encryption Standard)</strong>
                    <p className="text-xs mt-1">较老的对称加密算法，密钥较短，不推荐</p>
                  </div>
                  <div>
                    <strong>Rabbit</strong>
                    <p className="text-xs mt-1">流密码算法，速度快，适合实时应用</p>
                  </div>
                  <div>
                    <strong>RC4</strong>
                    <p className="text-xs mt-1">流密码算法，实现简单，但存在安全漏洞</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">安全建议</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>首选 AES</strong>：目前最安全的对称加密算法</li>
                  <li>• <strong>强密钥</strong>：使用至少 16 位随机密钥</li>
                  <li>• <strong>密钥管理</strong>：安全存储和传输密钥</li>
                  <li>• <strong>定期更换</strong>：定期更换加密密钥</li>
                  <li>• <strong>环境安全</strong>：在安全环境中进行加密操作</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { ResultDisplay } from '@/components/ui';
import { Key, RefreshCw } from 'lucide-react';
import CryptoJS from 'crypto-js';

const hmacAlgorithms = [
  { value: 'sha256', label: 'HMAC-SHA256', description: '256-bit HMAC, widely used' },
  { value: 'sha1', label: 'HMAC-SHA1', description: '160-bit HMAC, deprecated for security' },
  { value: 'sha512', label: 'HMAC-SHA512', description: '512-bit HMAC, very secure' },
  { value: 'md5', label: 'HMAC-MD5', description: '128-bit HMAC, not recommended for security' },
];

export default function HmacGeneratorPage() {
  const [message, setMessage] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState('sha256');
  const [hmac, setHmac] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateHmac = useCallback(() => {
    if (!message.trim() || !secret.trim()) {
      setHmac('');
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      try {
        let calculatedHmac;
        switch (algorithm) {
          case 'sha256':
            calculatedHmac = CryptoJS.HmacSHA256(message, secret).toString();
            break;
          case 'sha1':
            calculatedHmac = CryptoJS.HmacSHA1(message, secret).toString();
            break;
          case 'sha512':
            calculatedHmac = CryptoJS.HmacSHA512(message, secret).toString();
            break;
          case 'md5':
            calculatedHmac = CryptoJS.HmacMD5(message, secret).toString();
            break;
          default:
            calculatedHmac = CryptoJS.HmacSHA256(message, secret).toString();
        }
        setHmac(calculatedHmac);
      } catch (error) {
        console.error('HMAC calculation error:', error);
        setHmac('Error calculating HMAC');
      } finally {
        setIsCalculating(false);
      }
    }, 10);
  }, [message, secret, algorithm]);

  useEffect(() => {
    calculateHmac();
  }, [calculateHmac]);

  const handleCopyHmac = () => {
    navigator.clipboard.writeText(hmac).then(() => {
      console.log('HMAC copied to clipboard');
    });
  };

  const handleClear = () => {
    setMessage('');
    setSecret('');
    setHmac('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">HMAC 生成器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            生成 HMAC（Hash-based Message Authentication Code）哈希值，用于验证消息完整性和身份验证。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                输入参数
              </CardTitle>
              <CardDescription>
                输入消息内容和密钥来生成 HMAC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 算法选择 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">选择 HMAC 算法</label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择算法" />
                  </SelectTrigger>
                  <SelectContent>
                    {hmacAlgorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        <div>
                          <div className="font-medium">{algo.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {algo.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 消息输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">消息内容</label>
                <Textarea
                  placeholder="输入要计算 HMAC 的消息..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* 密钥输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">密钥</label>
                <Textarea
                  placeholder="输入密钥..."
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {message.length} 字符消息 | {secret.length} 字符密钥
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={calculateHmac}
                    disabled={isCalculating}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
                    重新计算
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClear}>
                    清空
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 结果区域 */}
          <ResultDisplay
            title="HMAC 结果"
            result={hmac}
            type="text"
            showCopy={!!hmac}
            onCopy={handleCopyHmac}
            placeholder="输入消息和密钥后将自动计算 HMAC"
          />
        </div>

        {/* 算法说明 */}
        <Card>
          <CardHeader>
            <CardTitle>算法说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hmacAlgorithms.map((algo) => (
                <div
                  key={algo.value}
                  className={`p-4 rounded-lg border ${
                    algorithm === algo.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <h3 className="font-medium mb-1">{algo.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {algo.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 使用指南 */}
        <Card>
          <CardHeader>
            <CardTitle>使用指南</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">什么是 HMAC？</h4>
                <p className="text-muted-foreground">
                  HMAC（Hash-based Message Authentication Code）是一种使用加密哈希函数和密钥来验证消息完整性和身份验证的机制。
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">常见用途</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>API 签名验证</strong>：验证 API 请求的合法性</li>
                  <li>• <strong>消息完整性检查</strong>：确保传输过程中消息未被篡改</li>
                  <li>• <strong>JWT 签名</strong>：JSON Web Token 的签名生成</li>
                  <li>• <strong>密码存储</strong>：配合盐值存储用户密码（不推荐直接使用）</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">安全建议</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 使用强密钥（至少 16 个字符）</li>
                  <li>• 定期更换密钥</li>
                  <li>• 不要在不安全的网络中传输密钥</li>
                  <li>• 推荐 HMAC-SHA256 或更强的算法</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

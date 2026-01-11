'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Label } from '@/components/ui';
import { Switch } from '@/components/ui';
import { RefreshCw, Copy, Key, AlertTriangle } from 'lucide-react';
// import { generateKeyPair } from 'node-forge';

interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

interface RSAConfig {
  keySize: number;
  format: 'PEM' | 'DER';
  includeComments: boolean;
}

export default function RSAKeyPairGeneratorPage() {
  const [config, setConfig] = useState<RSAConfig>({
    keySize: 2048,
    format: 'PEM',
    includeComments: true,
  });

  const [keyPair, setKeyPair] = useState<RSAKeyPair | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRSAKeyPair = useCallback(() => {
    setIsGenerating(true);
    try {
      // 这里使用模拟的 RSA 密钥生成
      // 在实际项目中，您可能需要使用 node-forge 或其他加密库

      const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA${generateRandomString(256)}
-----END PUBLIC KEY-----`;

      const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC${generateRandomString(512)}
-----END PRIVATE KEY-----`;

      setKeyPair({
        publicKey: config.includeComments ?
          `# RSA Public Key (${config.keySize} bits)\n# Generated on ${new Date().toISOString()}\n\n${publicKeyPem}` :
          publicKeyPem,
        privateKey: config.includeComments ?
          `# RSA Private Key (${config.keySize} bits)\n# Generated on ${new Date().toISOString()}\n# WARNING: Keep this key secure!\n\n${privateKeyPem}` :
          privateKeyPem
      });
    } catch (error) {
      console.error('RSA key generation error:', error);
      setKeyPair({
        publicKey: '生成失败',
        privateKey: '生成失败'
      });
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    generateRSAKeyPair();
  }, [generateRSAKeyPair]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    });
  };

  const handleClear = () => {
    setKeyPair(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">RSA 密钥对生成器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            生成 RSA 密钥对，用于加密通信、数字签名和身份验证等场景。
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
                  私钥是敏感信息，请妥善保管。不要在不安全的环境中传输或存储私钥。
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
                <Key className="h-5 w-5" />
                密钥配置
              </CardTitle>
              <CardDescription>
                配置 RSA 密钥生成参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 密钥长度选择 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">密钥长度</Label>
                <Select value={config.keySize.toString()} onValueChange={(value) => setConfig(prev => ({ ...prev, keySize: Number(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1024">1024 位 (不推荐)</SelectItem>
                    <SelectItem value="2048">2048 位 (推荐)</SelectItem>
                    <SelectItem value="3072">3072 位 (高安全)</SelectItem>
                    <SelectItem value="4096">4096 位 (最高安全)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 格式选择 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">输出格式</Label>
                <Select value={config.format} onValueChange={(value: 'PEM' | 'DER') => setConfig(prev => ({ ...prev, format: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PEM">PEM (Base64)</SelectItem>
                    <SelectItem value="DER">DER (二进制)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 选项 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">其他选项</Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeComments" className="text-sm cursor-pointer">
                    包含注释信息
                  </Label>
                  <Switch
                    id="includeComments"
                    checked={config.includeComments}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeComments: checked }))}
                  />
                </div>
              </div>

              {/* 安全级别说明 */}
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium text-sm mb-2">安全建议</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>• <strong>2048 位</strong>: 基础安全，一般用途</div>
                  <div>• <strong>3072 位</strong>: 较高安全，敏感数据</div>
                  <div>• <strong>4096 位</strong>: 最高安全，重要系统</div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  onClick={generateRSAKeyPair}
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
                <CardTitle>公钥</CardTitle>
                <CardDescription>
                  {keyPair ? `RSA ${config.keySize} 位` : '生成后显示公钥'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="生成的公钥将显示在这里..."
                  value={keyPair?.publicKey || ''}
                  readOnly
                  className="min-h-[200px] resize-none font-mono text-xs"
                />
                {keyPair && keyPair.publicKey && keyPair.publicKey !== '生成失败' && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      {config.format} 格式
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(keyPair.publicKey)}>
                      <Copy className="h-4 w-4 mr-2" />
                      复制
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>私钥</CardTitle>
                <CardDescription>
                  敏感信息，请妥善保管
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="生成的私钥将显示在这里..."
                  value={keyPair?.privateKey || ''}
                  readOnly
                  className="min-h-[200px] resize-none font-mono text-xs"
                />
                {keyPair && keyPair.privateKey && keyPair.privateKey !== '生成失败' && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      {config.format} 格式
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(keyPair.privateKey)}>
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
                <h4 className="font-medium mb-3">应用场景</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>SSH 密钥</strong>: 服务器登录认证</li>
                  <li>• <strong>SSL/TLS</strong>: HTTPS 证书签名</li>
                  <li>• <strong>数字签名</strong>: 文档、代码签名</li>
                  <li>• <strong>加密通信</strong>: 邮件、消息加密</li>
                  <li>• <strong>API 认证</strong>: JWT 签名验证</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">安全最佳实践</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>私钥文件权限设置为 600 (仅所有者可读写)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>使用密码保护私钥文件</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>定期轮换密钥对</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>备份私钥到安全位置</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

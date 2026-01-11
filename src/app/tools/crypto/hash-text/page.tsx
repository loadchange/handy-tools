'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { ResultDisplay } from '@/components/ui';
import { Hash, RefreshCw } from 'lucide-react';
import { hashText, type AlgoNames } from '@/utils/hash-text';

const hashAlgorithms = [
  { value: 'md5', label: 'MD5', description: '128-bit hash, fast but not secure' },
  { value: 'sha1', label: 'SHA-1', description: '160-bit hash, deprecated for security' },
  { value: 'sha256', label: 'SHA-256', description: '256-bit hash, widely used' },
  { value: 'sha512', label: 'SHA-512', description: '512-bit hash, very secure' },
];

export default function HashTextPage() {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('sha256');
  const [hash, setHash] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateHash = () => {
    if (!text.trim()) {
      setHash('');
      return;
    }

    setIsCalculating(true);

    // 使用 setTimeout 避免 UI 阻塞
    setTimeout(() => {
      try {
        const calculatedHash = hashText(algorithm.toUpperCase() as AlgoNames, text, 'Hex');
        setHash(calculatedHash);
      } catch (error) {
        console.error('Hash calculation error:', error);
        setHash('Error calculating hash');
      } finally {
        setIsCalculating(false);
      }
    }, 10);
  };

  useEffect(() => {
    calculateHash();
  }, [text, algorithm]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash).then(() => {
      // 这里可以添加 toast 通知
      console.log('Hash copied to clipboard');
    });
  };

  const handleClear = () => {
    setText('');
    setHash('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">文本哈希计算器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            计算文本的哈希值，支持多种哈希算法。可用于密码存储、数据完整性验证等场景。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                输入文本
              </CardTitle>
              <CardDescription>
                输入要计算哈希值的文本内容
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">选择哈希算法</label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择算法" />
                  </SelectTrigger>
                  <SelectContent>
                    {hashAlgorithms.map((algo) => (
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

              <div className="space-y-2">
                <label className="text-sm font-medium">文本内容</label>
                <Textarea
                  placeholder="输入要计算哈希的文本..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {text.length} 个字符
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={calculateHash}
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
            title="哈希结果"
            result={hash}
            type="text"
            showCopy={!!hash}
            onCopy={handleCopyHash}
            placeholder={algorithm ? '在左侧输入文本以计算哈希值' : '请先选择哈希算法'}
          />
        </div>

        {/* 算法说明 */}
        <Card>
          <CardHeader>
            <CardTitle>算法说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hashAlgorithms.map((algo) => (
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

        {/* 安全提示 */}
        <Card>
          <CardHeader>
            <CardTitle>安全提示</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• <strong>MD5</strong> 和 <strong>SHA-1</strong> 已被证明存在安全漏洞，不建议用于密码存储等安全场景</p>
              <p>• <strong>SHA-256</strong> 是目前广泛使用的安全哈希算法，适用于大多数场景</p>
              <p>• <strong>SHA-512</strong> 提供更高的安全性，适用于对安全性要求极高的场景</p>
              <p>• 对于密码存储，建议使用专门的密码哈希算法（如 bcrypt、argon2）并添加盐值</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

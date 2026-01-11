'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Label } from '@/components/ui';
import { Slider } from '@/components/ui';
import { RefreshCw, Copy, Hash, Settings } from 'lucide-react';
import { ulid } from 'ulid';

interface ULIDConfig {
  quantity: number;
  uppercase: boolean;
  encodingTime: boolean;
}

export default function ULIDGeneratorPage() {
  const [config, setConfig] = useState<ULIDConfig>({
    quantity: 1,
    uppercase: false,
    encodingTime: true,
  });

  const [ulids, setUlid] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateULIDs = useCallback(() => {
    setIsGenerating(true);
    try {
      const newUlid: string[] = [];

      for (let i = 0; i < config.quantity; i++) {
        let id = ulid();

        if (config.uppercase) {
          id = id.toUpperCase();
        }

        newUlid.push(id);
      }

      setUlid(newUlid);
    } catch (error) {
      console.error('ULID generation error:', error);
      setUlid(['生成失败']);
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  useEffect(() => {
    generateULIDs();
  }, [generateULIDs]);


  const handleCopyAll = () => {
    navigator.clipboard.writeText(ulids.join('\n')).then(() => {
      console.log('All ULIDs copied to clipboard');
    });
  };

  const handleClear = () => {
    setUlid([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ULID 生成器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            生成 ULID (Universally Unique Lexicographically Sortable Identifier)，兼具唯一性和排序能力的标识符。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 配置区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                生成配置
              </CardTitle>
              <CardDescription>
                配置 ULID 生成参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 数量控制 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">生成数量: {config.quantity}</Label>
                <Slider
                  value={[config.quantity]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, quantity: value[0] }))}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>

              {/* 格式选项 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">格式选项</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="uppercase" className="text-sm cursor-pointer">
                      大写字母
                    </Label>
                    <Switch
                      id="uppercase"
                      checked={config.uppercase}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, uppercase: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="encodingTime" className="text-sm cursor-pointer">
                      编码时间戳
                    </Label>
                    <Switch
                      id="encodingTime"
                      checked={config.encodingTime}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, encodingTime: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* ULID 特性说明 */}
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium text-sm mb-2">ULID 特性</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 128 位标识符</li>
                  <li>• 基于时间戳，支持排序</li>
                  <li>• URL 安全的 Base32 编码</li>
                  <li>• 比 UUID 更短（26 字符）</li>
                </ul>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  onClick={generateULIDs}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <Hash className="h-4 w-4 mr-2" />
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
          <Card>
            <CardHeader>
              <CardTitle>生成结果</CardTitle>
              <CardDescription>
                {ulids.length > 0 ? `已生成 ${ulids.length} 个 ULID` : '配置参数后自动生成'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="生成的 ULID 将显示在这里..."
                value={ulids.join('\n')}
                readOnly
                className="min-h-[200px] resize-none font-mono text-sm"
              />
              {ulids.length > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    共 {ulids.length} 个 ULID
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyAll}>
                      <Copy className="h-4 w-4 mr-2" />
                      复制全部
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ULID 结构说明 */}
        <Card>
          <CardHeader>
            <CardTitle>ULID 结构说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">ULID 结构</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>
                    <strong>编码格式</strong>
                    <p className="text-xs mt-1">Base32 (Crockford&apos;s)</p>
                  </div>
                  <div>
                    <strong>总长度</strong>
                    <p className="text-xs mt-1">26 个字符</p>
                  </div>
                  <div>
                    <strong>时间部分</strong>
                    <p className="text-xs mt-1">前 10 字符（48 位时间戳）</p>
                  </div>
                  <div>
                    <strong>随机部分</strong>
                    <p className="text-xs mt-1">后 16 字符（80 位随机数）</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">对比 UUID</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>排序友好</strong>：按时间自然排序</li>
                  <li>• <strong>更短</strong>：26 字符 vs 36 字符</li>
                  <li>• <strong>URL 安全</strong>：Base32 编码</li>
                  <li>• <strong>性能更好</strong>：无需随机数生成器</li>
                  <li>• <strong>时间戳可见</strong>：可提取创建时间</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用场景 */}
        <Card>
          <CardHeader>
            <CardTitle>使用场景</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">数据库主键</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 分布式数据库</li>
                  <li>• 分片表键</li>
                  <li>• 时间序列数据</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">消息队列</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 消息 ID</li>
                  <li>• 事件 ID</li>
                  <li>• 追踪 ID</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">其他用途</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 文件名</li>
                  <li>• 会话 ID</li>
                  <li>• 临时标识符</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

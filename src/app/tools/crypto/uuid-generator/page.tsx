'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { Switch } from '@/components/ui';
import { Label } from '@/components/ui';
import { Slider } from '@/components/ui';
import { RefreshCw, Copy, Hash, Settings } from 'lucide-react';
import { v4 as uuidv4, v1 as uuidv1, v6 as uuidv6, v7 as uuidv7 } from 'uuid';

interface UUIDConfig {
  version: 'v1' | 'v4' | 'v6' | 'v7';
  quantity: number;
  uppercase: boolean;
  removeHyphens: boolean;
}

export default function UUIDGeneratorPage() {
  const [config, setConfig] = useState<UUIDConfig>({
    version: 'v4',
    quantity: 1,
    uppercase: false,
    removeHyphens: false,
  });

  const [uuids, setUuids] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUUIDs = useCallback(() => {
    setIsGenerating(true);
    try {
      const newUuids: string[] = [];

      for (let i = 0; i < config.quantity; i++) {
        let uuid: string;

        switch (config.version) {
          case 'v1':
            uuid = uuidv1();
            break;
          case 'v4':
            uuid = uuidv4();
            break;
          case 'v6':
            uuid = uuidv6();
            break;
          case 'v7':
            uuid = uuidv7();
            break;
          default:
            uuid = uuidv4();
        }

        if (config.uppercase) {
          uuid = uuid.toUpperCase();
        }

        if (config.removeHyphens) {
          uuid = uuid.replace(/-/g, '');
        }

        newUuids.push(uuid);
      }

      setUuids(newUuids);
    } catch (error) {
      console.error('UUID generation error:', error);
      setUuids(['生成失败']);
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  useEffect(() => {
    generateUUIDs();
  }, [config, generateUUIDs]);


  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n')).then(() => {
      console.log('All UUIDs copied to clipboard');
    });
  };

  const handleClear = () => {
    setUuids([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">UUID 生成器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            生成各种版本的 UUID (Universally Unique Identifier)，适用于唯一标识符、数据库主键等场景。
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
                配置 UUID 生成参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 版本选择 */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">UUID 版本</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'v1', label: 'v1', desc: '时间戳 + MAC地址' },
                    { value: 'v4', label: 'v4', desc: '随机生成' },
                    { value: 'v6', label: 'v6', desc: '排序友好的v1' },
                    { value: 'v7', label: 'v7', desc: '时间戳 + 随机数' }
                  ].map((version) => (
                    <div key={version.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={version.value}
                        name="version"
                        value={version.value}
                        checked={config.version === version.value}
                        onChange={(e) => setConfig(prev => ({ ...prev, version: e.target.value as 'v1' | 'v4' | 'v6' | 'v7' }))}
                        className="w-4 h-4"
                      />
                      <Label htmlFor={version.value} className="text-sm cursor-pointer">
                        {version.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

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
                    <Label htmlFor="removeHyphens" className="text-sm cursor-pointer">
                      移除连字符
                    </Label>
                    <Switch
                      id="removeHyphens"
                      checked={config.removeHyphens}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, removeHyphens: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  onClick={generateUUIDs}
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
                {uuids.length > 0 ? `已生成 ${uuids.length} 个 UUID` : '配置参数后自动生成'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="生成的 UUID 将显示在这里..."
                value={uuids.join('\n')}
                readOnly
                className="min-h-[200px] resize-none font-mono text-sm"
              />
              {uuids.length > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    共 {uuids.length} 个 UUID
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

        {/* UUID 版本说明 */}
        <Card>
          <CardHeader>
            <CardTitle>UUID 版本说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">版本比较</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div>
                    <strong>v1 (基于时间)</strong>
                    <p className="text-xs mt-1">使用时间戳和 MAC 地址生成，有时序性</p>
                  </div>
                  <div>
                    <strong>v4 (随机)</strong>
                    <p className="text-xs mt-1">完全随机生成，最常用的版本</p>
                  </div>
                  <div>
                    <strong>v6 (排序友好)</strong>
                    <p className="text-xs mt-1">改进的 v1，更好的排序特性</p>
                  </div>
                  <div>
                    <strong>v7 (时间随机)</strong>
                    <p className="text-xs mt-1">结合时间戳和随机数，新一代标准</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">使用建议</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>数据库主键</strong>：推荐使用 v4 或 v7</li>
                  <li>• <strong>需要排序</strong>：推荐使用 v7 或 v6</li>
                  <li>• <strong>安全要求高</strong>：避免使用 v1</li>
                  <li>• <strong>URL 友好</strong>：考虑移除连字符</li>
                  <li>• <strong>跨平台兼容</strong>：使用标准格式 v4</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

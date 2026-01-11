'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Button } from '@/components/ui';
import { ResultDisplay } from '@/components/ui';
import { Shield, RefreshCw, Lock } from 'lucide-react';
import bcrypt from 'bcryptjs';

export default function BcryptPage() {
  const [password, setPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [salt, setSalt] = useState('');
  const [isHashing, setIsHashing] = useState(false);

  const hashPassword = async () => {
    if (!password.trim()) {
      setHashedPassword('');
      setSalt('');
      return;
    }

    setIsHashing(true);
    try {
      // 生成盐值
      const generatedSalt = await bcrypt.genSalt(rounds);
      const hash = await bcrypt.hash(password, generatedSalt);

      setSalt(generatedSalt);
      setHashedPassword(hash);
    } catch (error) {
      console.error('Bcrypt hashing error:', error);
      setHashedPassword('哈希生成失败');
    } finally {
      setIsHashing(false);
    }
  };

  useEffect(() => {
    // 不自动哈希，等待用户操作
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    });
  };

  const handleClear = () => {
    setPassword('');
    setHashedPassword('');
    setSalt('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Bcrypt 密码哈希器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            使用 Bcrypt 算法生成安全的密码哈希值，适用于用户密码存储和安全验证。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                密码哈希配置
              </CardTitle>
              <CardDescription>
                配置密码和哈希参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 密码输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">密码</label>
                <Textarea
                  placeholder="输入要哈希的密码..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* 强度选择 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">计算强度 (轮数): {rounds}</label>
                <input
                  type="range"
                  min={4}
                  max={31}
                  value={rounds}
                  onChange={(e) => setRounds(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>快速</span>
                  <span>安全</span>
                </div>
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={hashPassword}
                disabled={isHashing || !password.trim()}
                className="w-full"
              >
                <Lock className="h-4 w-4 mr-2" />
                {isHashing ? '哈希中...' : '生成哈希'}
              </Button>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {password.length} 个字符
                </span>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 结果区域 */}
          <div className="space-y-4">
            <ResultDisplay
              title="Bcrypt 哈希结果"
              result={hashedPassword}
              type="code"
              showCopy={!!hashedPassword}
              onCopy={() => handleCopy(hashedPassword)}
              placeholder="输入密码后点击'生成哈希'按钮"
            />

            <ResultDisplay
              title="盐值"
              result={salt}
              type="code"
              showCopy={!!salt}
              onCopy={() => handleCopy(salt)}
              placeholder="生成哈希时自动生成"
            />
          </div>
        </div>

        {/* 安全提示 */}
        <Card>
          <CardHeader>
            <CardTitle>安全提示</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">为什么使用 Bcrypt？</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>内置盐值</strong>：每次哈希都使用不同的盐值，防止彩虹表攻击</li>
                  <li>• <strong>可调节强度</strong>：通过增加计算轮数提高安全性</li>
                  <li>• <strong>验证友好</strong>：内置验证功能，无需额外处理</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">强度建议</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>4-10 轮</strong>：低安全性，适用于临时用途</li>
                  <li>• <strong>10-12 轮</strong>：标准安全，适用于大多数场景</li>
                  <li>• <strong>12-20 轮</strong>：高安全性，适用于重要应用</li>
                  <li>• <strong>20+ 轮</strong>：最高安全性，适用于敏感数据</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">最佳实践</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 使用强密码（至少 8 个字符）</li>
                  <li>• 定期更新密码</li>
                  <li>• 在 HTTPS 连接中传输</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

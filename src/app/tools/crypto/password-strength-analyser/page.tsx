'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Progress } from '@/components/ui';
import { Button } from '@/components/ui';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface PasswordStrength {
  score: number;
  level: 'weak' | 'moderate' | 'strong' | 'very-strong';
  color: string;
  feedback: string[];
  suggestions: string[];
  estimatedTime: {
    offline: string;
    online: string;
  };
}

export default function PasswordStrengthAnalyserPage() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const calculateStrength = useCallback((pwd: string): PasswordStrength => {
    if (!pwd) {
      return {
        score: 0,
        level: 'weak',
        color: 'bg-gray-300',
        feedback: [],
        suggestions: ['请输入密码'],
        estimatedTime: { offline: '瞬间', online: '瞬间' }
      };
    }

    let score = 0;
    const feedback: string[] = [];
    const suggestions: string[] = [];

    // 长度评分
    if (pwd.length >= 8) score += 15;
    if (pwd.length >= 12) score += 10;
    if (pwd.length >= 16) score += 10;

    // 字符类型评分
    if (/[a-z]/.test(pwd)) {
      score += 10;
    } else {
      suggestions.push('添加小写字母');
    }

    if (/[A-Z]/.test(pwd)) {
      score += 10;
    } else {
      suggestions.push('添加大写字母');
    }

    if (/\d/.test(pwd)) {
      score += 10;
    } else {
      suggestions.push('添加数字');
    }

    if (/[^a-zA-Z0-9]/.test(pwd)) {
      score += 15;
    } else {
      suggestions.push('添加特殊字符');
    }

    // 复杂性评分
    const uniqueChars = new Set(pwd).size;
    if (uniqueChars > pwd.length * 0.5) {
      score += 10;
    } else {
      suggestions.push('增加字符多样性');
    }

    // 连续字符检测
    if (!/(.)\1{2,}/.test(pwd)) {
      score += 10;
    } else {
      feedback.push('避免连续重复字符');
    }

    // 常见模式检测
    const commonPatterns = [
      /123456|password|qwerty|abc123/i,
      /012345|111111|222222/i,
      /(january|february|march|april|may|june|july|august|september|october|november|december)/i
    ];

    const hasCommonPattern = commonPatterns.some(pattern => pattern.test(pwd));
    if (!hasCommonPattern) {
      score += 10;
    } else {
      feedback.push('避免使用常见模式');
    }

    // 计算破解时间
    const combinations = Math.pow(pwd.length * 4, pwd.length);
    const offlineTime = calculateCrackTime(combinations, 1000000000000); // 1T hashes/s
    const onlineTime = calculateCrackTime(combinations, 1000); // 1K hashes/s

    // 确定强度级别
    let level: 'weak' | 'moderate' | 'strong' | 'very-strong';
    let color: string;
    let feedbackMsg: string[];

    if (score < 40) {
      level = 'weak';
      color = 'bg-red-500';
      feedbackMsg = ['密码太弱', ...feedback];
    } else if (score < 60) {
      level = 'moderate';
      color = 'bg-yellow-500';
      feedbackMsg = ['密码强度中等', ...feedback];
    } else if (score < 80) {
      level = 'strong';
      color = 'bg-green-500';
      feedbackMsg = ['密码强度良好', ...feedback];
    } else {
      level = 'very-strong';
      color = 'bg-green-600';
      feedbackMsg = ['密码非常强', ...feedback];
    }

    return {
      score: Math.min(score, 100),
      level,
      color,
      feedback: feedbackMsg,
      suggestions,
      estimatedTime: {
        offline: offlineTime,
        online: onlineTime
      }
    };
  }, []);

  const calculateCrackTime = (combinations: number, hashesPerSecond: number): string => {
    const seconds = combinations / hashesPerSecond;

    if (seconds < 1) return '瞬间';
    if (seconds < 60) return `${Math.ceil(seconds)} 秒`;
    if (seconds < 3600) return `${Math.ceil(seconds / 60)} 分钟`;
    if (seconds < 86400) return `${Math.ceil(seconds / 3600)} 小时`;
    if (seconds < 2592000) return `${Math.ceil(seconds / 86400)} 天`;
    if (seconds < 31536000) return `${Math.ceil(seconds / 2592000)} 个月`;
    return `${Math.ceil(seconds / 31536000)} 年`;
  };

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password, calculateStrength]);

  const generateStrongPassword = () => {
    const length = 16;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let newPassword = '';

    // 确保包含各种字符类型
    newPassword += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    newPassword += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    newPassword += '0123456789'[Math.floor(Math.random() * 10)];
    newPassword += '!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 26)];

    // 填充剩余长度
    for (let i = 4; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // 随机打乱
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(newPassword);
  };

  const getStrengthIcon = (level: string) => {
    switch (level) {
      case 'weak':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'strong':
      case 'very-strong':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStrengthText = (level: string) => {
    switch (level) {
      case 'weak':
        return '弱';
      case 'moderate':
        return '中等';
      case 'strong':
        return '强';
      case 'very-strong':
        return '非常强';
      default:
        return '未知';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">密码强度分析器</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            分析密码强度，提供改进建议，帮助您创建更安全的密码。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 输入区域 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  密码输入
                </CardTitle>
                <CardDescription>
                  输入要分析的密码
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    type={isVisible ? 'text' : 'password'}
                    placeholder="输入密码..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {isVisible ? '隐藏' : '显示'}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateStrongPassword} variant="outline" className="flex-1">
                    生成强密码
                  </Button>
                  <Button variant="outline" onClick={() => setPassword('')}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    清空
                  </Button>
                </div>

                {/* 强度指示器 */}
                {strength && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStrengthIcon(strength.level)}
                        <span className="font-medium">{getStrengthText(strength.level)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {strength.score}/100
                      </span>
                    </div>
                    <Progress value={strength.score} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 分析结果 */}
            {strength && (
              <Card>
                <CardHeader>
                  <CardTitle>分析结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 破解时间估算 */}
                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="font-medium mb-2">破解时间估算</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>离线攻击:</span>
                          <span className="font-mono">{strength.estimatedTime.offline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>在线攻击:</span>
                          <span className="font-mono">{strength.estimatedTime.online}</span>
                        </div>
                      </div>
                    </div>

                    {/* 密码统计 */}
                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="font-medium mb-2">密码统计</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>长度:</span>
                          <span>{password.length} 字符</span>
                        </div>
                        <div className="flex justify-between">
                          <span>唯一字符:</span>
                          <span>{new Set(password).size} 个</span>
                        </div>
                        <div className="flex justify-between">
                          <span>字符类型:</span>
                          <span>
                            {/[a-z]/.test(password) && '小写 '}
                            {/[A-Z]/.test(password) && '大写 '}
                            {/\d/.test(password) && '数字 '}
                            {/[^a-zA-Z0-9]/.test(password) && '特殊'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 建议区域 */}
          <div className="space-y-4">
            {strength && strength.feedback.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>反馈</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {strength.feedback.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        {item.startsWith('密码') ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {strength && strength.suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>改进建议</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {strength.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-4 h-4 border-2 border-blue-500 rounded-full mt-0.5 flex-shrink-0">
                          <div className="w-full h-full bg-blue-500 rounded-full scale-50" />
                        </div>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 密码安全提示 */}
            <Card>
              <CardHeader>
                <CardTitle>安全提示</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• 使用至少 12 个字符的密码</p>
                  <p>• 混合使用大小写字母、数字和特殊字符</p>
                  <p>• 避免使用个人信息或常见词汇</p>
                  <p>• 为不同账户使用不同密码</p>
                  <p>• 定期更换重要账户的密码</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

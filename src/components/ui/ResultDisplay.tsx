import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ResultDisplayProps {
  title?: string;
  result: string;
  type?: 'text' | 'json' | 'code' | 'image';
  showCopy?: boolean;
  showDownload?: boolean;
  onCopy?: () => void;
  onDownload?: () => void;
  className?: string;
  placeholder?: string;
}

export function ResultDisplay({
  title = 'Result',
  result,
  type = 'text',
  showCopy = true,
  showDownload = false,
  onCopy,
  onDownload,
  className,
  placeholder = 'Result will be displayed here...',
}: ResultDisplayProps) {
  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else {
      navigator.clipboard.writeText(result);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (result) {
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'result.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {showCopy && result && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
          {showDownload && result && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-2"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="w-full">
            {type === 'image' ? (
              <div className="flex justify-center">
                <Image
                  src={result}
                  alt="Generated result"
                  width={300}
                  height={300}
                  className="max-w-full h-auto rounded-md border"
                />
              </div>
            ) : (
              <pre className={cn(
                'w-full p-4 rounded-md bg-secondary text-secondary-foreground overflow-auto text-sm',
                type === 'json' && 'font-mono',
                type === 'code' && 'font-mono'
              )}>
                {result}
              </pre>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-8">
            {placeholder}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

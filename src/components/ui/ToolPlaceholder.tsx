import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

interface ToolPlaceholderProps {
  title: string;
  description: string;
}

export function ToolPlaceholder({ title, description }: ToolPlaceholderProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tool Migration in Progress</CardTitle>
          <CardDescription>
            This tool is being migrated from Ant Design to shadcn/ui. Please check back later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We are upgrading all tools&apos; UI libraries to provide a better user experience and a more modern design.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

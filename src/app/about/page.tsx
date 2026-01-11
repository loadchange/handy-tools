import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">System Info</h1>
        <p className="text-muted-foreground">
          HandyTools is a futuristic collection of high-performance tools designed for the modern developer.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mission Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Centralize developer utilities for maximum efficiency.</li>
            <li>Deliver superior UX with stable, high-performance execution.</li>
            <li>Continuous iteration based on community intelligence.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Source Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This system is open source. Submit issues or PRs to upgrade the mainframe.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

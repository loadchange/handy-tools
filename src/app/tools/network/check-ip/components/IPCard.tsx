import React from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Server, Network } from 'lucide-react';

export interface IPData {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  asn?: string;
  asnOrg?: string;
  latitude?: number;
  longitude?: number;
  sourceName: string;
  isLoading: boolean;
  error?: string;
  isIPv6?: boolean;
}

interface IPCardProps {
  data: IPData;
  onRefresh?: () => void;
}

export const IPCard: React.FC<IPCardProps> = ({ data }) => {
  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md border-opacity-50">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {data.sourceName}
            </h3>
            <div className="flex items-center gap-2">
              {data.isLoading ? (
                <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
              ) : (
                <div className="text-2xl font-bold tracking-tight break-all font-mono text-primary">
                  {data.ip || "N/A"}
                </div>
              )}
            </div>
          </div>
          {data.country && !data.isLoading && (
             <div className="text-2xl" title={data.country}>{getFlagEmoji(data.country)}</div>
          )}
        </div>

        {data.error ? (
           <div className="text-sm text-destructive mt-2">{data.error}</div>
        ) : (
          <div className="space-y-3 mt-4">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-foreground/80">
                {data.isLoading ? (
                  <span className="inline-block h-4 w-24 bg-muted animate-pulse rounded"></span>
                ) : (
                  [data.city, data.region, data.country].filter(Boolean).join(', ') || "Unknown Location"
                )}
              </span>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <Server className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-foreground/80">
                 {data.isLoading ? (
                  <span className="inline-block h-4 w-32 bg-muted animate-pulse rounded"></span>
                ) : (
                   data.isp || "Unknown ISP"
                )}
              </span>
            </div>

             {(data.asn || data.asnOrg) && (
              <div className="flex items-start gap-2 text-sm">
                <Network className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-foreground/80">
                   {data.isLoading ? (
                    <span className="inline-block h-4 w-20 bg-muted animate-pulse rounded"></span>
                  ) : (
                     `${data.asn || ''} ${data.asnOrg || ''}`.trim()
                  )}
                </span>
              </div>
             )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper to convert country code to flag emoji
function getFlagEmoji(countryCode: string) {
  if (!countryCode) return '';
  // Check if it's already an emoji (some APIs return emoji) or full name
  if (countryCode.length > 2) return '';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

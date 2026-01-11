import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get IP from headers (standard for proxies/Next.js)
  let ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';

  // Clean up IP (remove IPv6 prefix if present like ::ffff:)
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  const userAgent = req.headers.get('user-agent') || 'unknown';

  let geoData = {
    isp: 'Local Network',
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown'
  };

  // If public IP, try to fetch geo data
  // Simple check for private IPs: 10.x, 192.168.x, 172.16-31.x, 127.x
  const isPrivate = ip.startsWith('10.') ||
                    ip.startsWith('192.168.') ||
                    (ip.startsWith('172.') && parseInt(ip.split('.')[1], 10) >= 16 && parseInt(ip.split('.')[1], 10) <= 31) ||
                    ip.startsWith('127.') ||
                    ip === '::1';

  if (!isPrivate) {
    try {
      const res = await fetch(`https://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,org,as`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          geoData = {
            isp: data.isp,
            city: data.city,
            region: data.regionName,
            country: data.country
          };
        }
      }
    } catch (e) {
      console.error('Failed to fetch geo data', e);
    }
  }

  return NextResponse.json({
    ip,
    userAgent,
    ...geoData
  });
}

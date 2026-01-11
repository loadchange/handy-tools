'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Input } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Search } from 'lucide-react';

const HTTP_STATUS_CODES = [
  { code: 100, title: 'Continue', desc: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, title: 'Switching Protocols', desc: 'The requester has asked the server to switch protocols and the server has agreed to do so.' },
  { code: 200, title: 'OK', desc: 'Standard response for successful HTTP requests.' },
  { code: 201, title: 'Created', desc: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 202, title: 'Accepted', desc: 'The request has been accepted for processing, but the processing has not been completed.' },
  { code: 204, title: 'No Content', desc: 'The server successfully processed the request and is not returning any content.' },
  { code: 301, title: 'Moved Permanently', desc: 'This and all future requests should be directed to the given URI.' },
  { code: 302, title: 'Found', desc: 'Tells the client to look at (browse to) another URL.' },
  { code: 304, title: 'Not Modified', desc: 'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.' },
  { code: 307, title: 'Temporary Redirect', desc: 'The request should be repeated with another URI; however, future requests should still use the original URI.' },
  { code: 308, title: 'Permanent Redirect', desc: 'The request and all future requests should be repeated using another URI.' },
  { code: 400, title: 'Bad Request', desc: 'The server cannot or will not process the request due to an apparent client error.' },
  { code: 401, title: 'Unauthorized', desc: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.' },
  { code: 403, title: 'Forbidden', desc: 'The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource.' },
  { code: 404, title: 'Not Found', desc: 'The requested resource could not be found but may be available in the future.' },
  { code: 405, title: 'Method Not Allowed', desc: 'A request method is not supported for the requested resource.' },
  { code: 408, title: 'Request Timeout', desc: 'The server timed out waiting for the request.' },
  { code: 409, title: 'Conflict', desc: 'Indicates that the request could not be processed because of conflict in the request, such as an edit conflict.' },
  { code: 410, title: 'Gone', desc: 'Indicates that the resource requested is no longer available and will not be available again.' },
  { code: 418, title: 'I\'m a teapot', desc: 'The server refuses the attempt to brew coffee with a teapot.' },
  { code: 429, title: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time ("rate limiting").' },
  { code: 500, title: 'Internal Server Error', desc: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.' },
  { code: 501, title: 'Not Implemented', desc: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.' },
  { code: 502, title: 'Bad Gateway', desc: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
  { code: 503, title: 'Service Unavailable', desc: 'The server is currently unavailable (because it is overloaded or down for maintenance).' },
  { code: 504, title: 'Gateway Timeout', desc: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' },
];

type BadgeVariant = 'default' | 'destructive' | 'outline' | 'secondary';

export default function HttpStatusCodesPage() {
  const [search, setSearch] = useState('');

  const filteredCodes = HTTP_STATUS_CODES.filter(item =>
    item.code.toString().includes(search) ||
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.desc.toLowerCase().includes(search.toLowerCase())
  );

  const getColor = (code: number): BadgeVariant => {
    if (code >= 500) return 'destructive';
    if (code >= 400) return 'outline'; // Warning/Error
    if (code >= 300) return 'secondary'; // Redirect
    if (code >= 200) return 'default'; // Success
    return 'secondary';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">HTTP Status Codes</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Searchable list of standard HTTP status codes and their meanings.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4">
        {filteredCodes.map((item) => (
          <Card key={item.code} className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center gap-4 py-4">
              <Badge variant={getColor(item.code)} className="text-lg py-1 px-3 min-w-[4.5rem] justify-center">
                {item.code}
              </Badge>
              <div className="space-y-1">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

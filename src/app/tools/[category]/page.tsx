'use client';

import { allTools } from '@/lib/tools-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  // Ensure category is a string and handle potential array if catch-all is used (though here it's [category])
  const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category;

  if (!categorySlug) return notFound();

  // Normalize category for comparison
  const categoryName = categorySlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

    // Special case for 'Images and Videos' which might be URL encoded or slugified differently
  const tools = allTools.filter(tool => {
      if (categorySlug === 'images-videos' && tool.category === 'Images and Videos') return true;
      return tool.category.toLowerCase() === categoryName.toLowerCase();
  });

  if (tools.length === 0) {
      // Fallback or 404 if no tools found for this category
      // It's possible the slug doesn't match the category string exactly
      // let's try a loose match
       const looseMatch = allTools.filter(tool =>
          tool.category.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
       );
       if (looseMatch.length === 0) {
        // We might want to just show empty or redirect, but for now let's show a message
       } else {
           // use loose match
       }
  }

  // Re-filter with the best logic we have
   const displayTools = allTools.filter(tool =>
          tool.category.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase() ||
           (categorySlug === 'images-videos' && tool.category === 'Images and Videos')
       );


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{displayTools[0]?.category || categoryName}</h1>
         <p className="text-muted-foreground max-w-2xl mx-auto">
           Specialized utilities for {displayTools[0]?.category || categoryName} tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} className="block h-full">
              <Card className="h-full hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base font-medium leading-none">
                    {tool.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 text-xs mt-2">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
       {displayTools.length === 0 && (
         <div className="text-center py-12 text-muted-foreground">
            No tools found in this sector.
         </div>
      )}
    </div>
  );
}

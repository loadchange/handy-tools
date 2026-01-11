'use client';

import Link from 'next/link';
import { useToolStore } from '@/stores/use-tool-store';
import { allTools } from '@/lib/tools-list';
import { Star } from 'lucide-react';

export default function FavoritesPage() {
  const { favoriteTools, toggleFavorite } = useToolStore((s) => ({ favoriteTools: s.favoriteTools, toggleFavorite: s.toggleFavorite }));
  const favorites = favoriteTools
    .map((name) => allTools.find((t) => t.name === name))
    .filter(Boolean) as typeof allTools;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-muted-foreground">You have not saved any tools yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((tool) => (
            <div key={tool.href} className="p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{tool.category}</p>
                </div>
                <button
                  className="p-1 rounded hover:bg-accent"
                  onClick={() => toggleFavorite(tool.name)}
                  title="Remove from favorites"
                >
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              <Link href={tool.href} className="text-primary hover:underline">Open Tool →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

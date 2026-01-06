import { useState, useEffect, useCallback, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Food } from '@/types';
import { cn, debounce } from '@/lib/utils';

interface SearchBarProps {
  foods: Food[];
  onSelectFood: (food: Food) => void;
  recentSearches?: string[];
  onAddRecent?: (query: string) => void;
}

export const SearchBar = forwardRef<
  { focus: () => void },
  SearchBarProps
>(({ foods, onSelectFood, recentSearches = [], onAddRecent }, forwardedRef) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Perform the actual search logic
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const terms = searchQuery.toLowerCase().split(/\s+/);

    const filtered = foods.filter((food) => {
      const nameMatch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = food.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const categoryMatch = food.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Match all terms for better search
      const allTermsMatch = terms.every((term) =>
        food.name.toLowerCase().includes(term)
      );

      return nameMatch || tagMatch || categoryMatch || allTermsMatch;
    });

    // Sort by relevance and limit to 10 results
    const sorted = filtered
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const queryLower = searchQuery.toLowerCase();

        // Exact match first
        if (aName === queryLower) return -1;
        if (bName === queryLower) return 1;

        // Starts with query
        if (aName.startsWith(queryLower) && !bName.startsWith(queryLower)) return -1;
        if (bName.startsWith(queryLower) && !aName.startsWith(queryLower)) return 1;

        return aName.localeCompare(bName);
      })
      .slice(0, 10);

    setResults(sorted);

    if (searchQuery.trim() && onAddRecent) {
      onAddRecent(searchQuery);
    }
  }, [foods, onAddRecent]);

  // Debounced search function - stable reference with useMemo
  const debouncedSearch = useMemo(
    () => debounce(performSearch, 300),
    [performSearch]
  );

  // Expose focus method via ref
  useImperativeHandle(forwardedRef, () => ({
    focus: () => {
      inputRef.current?.focus();
      setIsFocused(true);
    }
  }), []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleSelectFood = (food: Food) => {
    onSelectFood(food);
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  const handleRecentSearch = (recentQuery: string) => {
    setQuery(recentQuery);
    performSearch(recentQuery);
  };

  const showDropdown = isFocused && (query.trim() || (recentSearches.length > 0 && !query));

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for foods (e.g., 'apple', 'chicken', 'oatmeal')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-10 h-12 text-base"
          ref={inputRef}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {query.trim() ? (
            // Search results
            <ScrollArea className="max-h-80">
              {results.length > 0 ? (
                <div className="p-2">
                  {results.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-md transition-colors',
                        'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{food.name}</div>
                          <div className="text-sm text-gray-500">
                            {food.servingSize} {food.servingUnit}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">{food.calories} cal</Badge>
                          {food.tags && food.tags.length > 0 && (
                            <div className="text-xs text-gray-400 mt-1">
                              {food.tags.slice(0, 2).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No foods found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </ScrollArea>
          ) : (
            // Recent searches
            recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4" />
                  Recent searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 5).map((recentQuery, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecentSearch(recentQuery)}
                      className="text-sm"
                    >
                      {recentQuery}
                    </Button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

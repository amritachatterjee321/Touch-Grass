import React from 'react';
import { Badge } from './ui';
import { Sparkles, Target, Star } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'All': '🌟',
      'Music': '🎵',
      'Sports': '⚽',
      'Food': '🍕',
      'Outdoor': '🏔️',
      'Arts': '🎨',
      'Social': '👥',
      'Learning': '📚'
    };
    return icons[category] || '🎯';
  };

  const getCategoryColor = (category: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-[#32cd32] text-[#2d2d2d] border-[#228b22] shadow-lg transform scale-105';
    }
    
    return 'bg-[#98fb98] text-[#2d2d2d] border-[#32cd32] hover:bg-[#90ee90] hover:border-[#228b22]';
  };

  return (
    <div className="lilac-event-box retro-border p-3 sm:p-4">
      <div className="text-center mb-3 sm:mb-4">
        <h2 className="text-[#ff6347] text-lg sm:text-xl tracking-wide text-center">
          <span className="pixel-perfect">~ AVAILABLE QUESTS ~</span>
        </h2>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 sm:gap-3 justify-start sm:justify-center">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                className={`retro-button px-3 sm:px-6 py-2 sm:py-3 flex-shrink-0 text-xs sm:text-sm min-h-[40px] sm:min-h-[48px] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-2 ${getCategoryColor(category, isSelected)}`}
                onClick={() => onCategoryChange(category)}
                aria-pressed={isSelected}
                aria-label={`Filter by ${category} category`}
                title={`Show ${category} quests`}
              >
                <span className="text-base sm:text-lg" role="img" aria-label={`${category} icon`}>
                  {getCategoryIcon(category)}
                </span>
                <span className="pixel-perfect hidden sm:inline">{category.toUpperCase()}</span>
                <span className="pixel-perfect sm:hidden">{category}</span>
                {isSelected && (
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse pixel-perfect" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { itemCategories } from '@/services/itemService';
import { ItemCategory } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface CategoryFilterProps {
  selectedCategory: ItemCategory | undefined;
  onSelectCategory: (category: ItemCategory | undefined) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Verificar se precisa mostrar as setas baseado na posição de rolagem
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    // Configurar checagem inicial e listener para rolagem
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      // Verificar também após renderização completa
      window.addEventListener('resize', checkScrollPosition);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Função para ir para categoria específica tornando-a centralizada
  const scrollToCategory = (index: number) => {
    if (scrollContainerRef.current) {
      const buttons = scrollContainerRef.current.querySelectorAll('button');
      if (buttons[index]) {
        const container = scrollContainerRef.current;
        const button = buttons[index];
        const containerCenter = container.clientWidth / 2;
        const buttonLeft = button.offsetLeft;
        const buttonCenter = buttonLeft + button.offsetWidth / 2;
        
        container.scrollTo({
          left: buttonCenter - containerCenter,
          behavior: 'smooth'
        });
      }
    }
  };

  // Handler que centraliza a categoria selecionada
  const handleCategorySelect = (category: ItemCategory | undefined, index: number) => {
    onSelectCategory(category);
    scrollToCategory(index);
  };

  return (
    <div className="relative w-full py-4">
      <div className="flex items-center">
        {/* Left scroll button - mostrar apenas quando necessário */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-200 hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm bg-white/80 backdrop-blur-sm mr-2 z-10`}
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
        
        {/* Scrollable container */}
        <div 
          className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          ref={scrollContainerRef}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex space-x-2 px-1 pb-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySelect(undefined, 0)}
              className="flex-shrink-0 snap-center"
            >
              Todos
            </Button>
            
            {itemCategories.map((category, index) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategorySelect(category.value, index + 1)}
                className="flex-shrink-0 snap-center whitespace-nowrap"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Right scroll button - mostrar apenas quando necessário */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-200 hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm bg-white/80 backdrop-blur-sm ml-2 z-10`}
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      </div>
      
      {/* Mobile hint */}
      <div className="mt-2 text-center text-xs text-muted-foreground md:hidden">
        <span>Deslize para ver mais categorias</span>
      </div>

      {/* Applying CSS for hiding scrollbar using standard CSS instead of jsx tag */}
      <style>
        {`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        `}
      </style>
    </div>
  );
};

export default CategoryFilter;

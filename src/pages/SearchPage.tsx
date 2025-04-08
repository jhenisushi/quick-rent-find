
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ItemList from '@/components/ItemList';
import CategoryFilter from '@/components/CategoryFilter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getItems } from '@/services/itemService';
import { Item, ItemCategory } from '@/types';
import { SearchIcon } from 'lucide-react';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | undefined>(undefined);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const fetchedItems = await getItems(selectedCategory, searchTerm);
        setItems(fetchedItems);
      } catch (error) {
        console.error('Erro ao carregar itens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [selectedCategory, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca já é realizada pelo useEffect quando searchTerm muda
  };

  const handleCategorySelect = (category: ItemCategory | undefined) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <h1 className="mb-6 text-2xl font-bold">Buscar itens para alugar</h1>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Digite o que você procura..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Buscar</Button>
            </div>
          </form>

          <div className="mb-6">
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect} 
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {isLoading 
                  ? 'Carregando itens...' 
                  : items.length > 0
                    ? `${items.length} ${items.length === 1 ? 'item encontrado' : 'itens encontrados'}`
                    : 'Nenhum item encontrado'
                }
              </h2>
            </div>

            <ItemList 
              items={items} 
              isLoading={isLoading} 
              emptyMessage={
                searchTerm
                  ? `Nenhum resultado encontrado para "${searchTerm}"`
                  : "Nenhum item disponível nesta categoria"
              }
            />
          </div>
        </div>
      </main>

      <footer className="py-6 border-t bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-rent-primary">RentFind</span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} RentFind. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;

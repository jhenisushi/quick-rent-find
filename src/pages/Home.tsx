
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ItemList from '@/components/ItemList';
import CategoryFilter from '@/components/CategoryFilter';
import { Button } from '@/components/ui/button';
import { getItems } from '@/services/itemService';
import { Item, ItemCategory } from '@/types';
import { Search, ArrowRight, MessageSquare, Calendar } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | undefined>(undefined);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const fetchedItems = await getItems(selectedCategory);
        setItems(fetchedItems);
      } catch (error) {
        console.error('Erro ao carregar itens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [selectedCategory]);

  const handleCategorySelect = (category: ItemCategory | undefined) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 text-center bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 mx-auto">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              Alugue qualquer coisa, <br className="hidden md:block" />
              <span className="text-rent-primary">quando precisar</span>
            </h1>
            <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-600">
              Encontre itens para alugar perto de você ou anuncie seus próprios itens para ganhar uma renda extra.
            </p>
            <div className="flex flex-col justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/search')}
                className="flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Encontrar Itens
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/novo-anuncio')}
              >
                Anunciar Item
              </Button>
            </div>
          </div>
        </section>

        {/* Categories and Items Section */}
        <section className="py-8">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Itens disponíveis</h2>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/search')}
                className="flex items-center"
              >
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect} 
            />
            
            <div className="mt-6">
              <ItemList 
                items={items} 
                isLoading={isLoading} 
                emptyMessage="Nenhum item disponível nesta categoria" 
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <h2 className="mb-10 text-3xl font-bold text-center">Como funciona</h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="p-6 text-center bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-rent-primary rounded-full">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Encontre</h3>
                <p className="text-gray-600">
                  Pesquise e encontre itens disponíveis para alugar perto de você.
                </p>
              </div>
              
              <div className="p-6 text-center bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white rounded-full bg-rent-secondary">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Converse</h3>
                <p className="text-gray-600">
                  Entre em contato com o proprietário, combine os detalhes do aluguel.
                </p>
              </div>
              
              <div className="p-6 text-center bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white rounded-full bg-rent-accent">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Alugue</h3>
                <p className="text-gray-600">
                  Combine a retirada e devolução do item pelo período desejado.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-rent-primary">Temporu</span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Temporu. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

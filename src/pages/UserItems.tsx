
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ItemList from '@/components/ItemList';
import { Button } from '@/components/ui/button';
import { getUserItems } from '@/services/itemService';
import { useUser } from '@/contexts/UserContext';
import { Item } from '@/types';
import { PlusCircle } from 'lucide-react';

const UserItems: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirecionar para a página de login se o usuário não estiver autenticado
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadUserItems = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const fetchedItems = await getUserItems(user.id);
        setItems(fetchedItems);
      } catch (error) {
        console.error('Erro ao carregar itens do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserItems();
  }, [user]);

  if (!isAuthenticated) {
    return null; // Não renderizar nada enquanto redireciona
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
            <h1 className="text-2xl font-bold">Meus anúncios</h1>
            <Button onClick={() => navigate('/novo-anuncio')} className="flex items-center justify-center">
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar novo anúncio
            </Button>
          </div>

          <div>
            <ItemList 
              items={items} 
              isLoading={isLoading} 
              emptyMessage="Você ainda não tem anúncios cadastrados" 
            />
            
            {!isLoading && items.length === 0 && (
              <div className="mt-6 text-center">
                <Button onClick={() => navigate('/novo-anuncio')} variant="outline" className="flex items-center mx-auto">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Anunciar meu primeiro item
                </Button>
              </div>
            )}
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

export default UserItems;

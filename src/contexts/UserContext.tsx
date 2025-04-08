
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserContextType } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Mock de dados de usuário
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '(11) 99999-9999',
    createdAt: new Date(),
  },
  {
    id: '2', 
    name: 'Maria Souza',
    email: 'maria@email.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    phone: '(11) 88888-8888',
    createdAt: new Date(),
  }
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Usuário não encontrado');
      }
      
      // Em um cenário real, verificaríamos a senha aqui
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo(a), ${foundUser.name}!`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }
      
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        name,
        email,
        avatar: `https://i.pravatar.cc/150?img=${mockUsers.length + 3}`,
        createdAt: new Date(),
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast({
        title: 'Cadastro realizado com sucesso',
        description: `Bem-vindo(a), ${name}!`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao cadastrar',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logout realizado com sucesso',
      description: 'Você foi desconectado da sua conta.',
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      isAuthenticated: !!user 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

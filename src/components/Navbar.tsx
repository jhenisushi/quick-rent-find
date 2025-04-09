
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { SearchIcon, PlusCircle, MessageSquare, User, Menu, X, LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogin = () => {
    navigate('/login');
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-rent-primary">Temporu</span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Busque por itens para alugar..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="ghost" size="sm" className="ml-2">
            Buscar
          </Button>
        </form>

        {/* Desktop Navigation */}
        <div className="items-center hidden space-x-4 md:flex">
          <Button variant="outline" onClick={() => navigate('/novo-anuncio')} className="flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            Anunciar
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/meus-anuncios')}>
                  Meus Anúncios
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/mensagens')}>
                  Mensagens
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" onClick={() => navigate('/login')}>
              Entrar
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Login Button for Mobile */}
          {!isAuthenticated && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogin} 
              className="ml-2"
              aria-label="Entrar ou Cadastrar"
            >
              <LogIn className="w-5 h-5" />
            </Button>
          )}
          
          {/* Menu Button for Mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu} 
            className="ml-0"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-16 bg-white md:hidden">
          <div className="p-4">
            <form onSubmit={handleSearch} className="flex items-center mb-6">
              <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Busque por itens para alugar..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" variant="ghost" size="sm" className="ml-2">
                Buscar
              </Button>
            </form>

            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-start w-full" 
                onClick={() => {
                  navigate('/novo-anuncio');
                  toggleMenu();
                }}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Anunciar Item
              </Button>

              {isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-start w-full" 
                    onClick={() => {
                      navigate('/meus-anuncios');
                      toggleMenu();
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Meus Anúncios
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-start w-full" 
                    onClick={() => {
                      navigate('/mensagens');
                      toggleMenu();
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Mensagens
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => {
                    navigate('/login');
                    toggleMenu();
                  }}
                >
                  Entrar / Cadastrar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

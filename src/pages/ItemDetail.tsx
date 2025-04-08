
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MapComponent from '@/components/MapComponent';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getItemById, getCategoryLabel } from '@/services/itemService';
import { createChat } from '@/services/chatService';
import { Item } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { 
  Calendar, 
  MapPin, 
  User, 
  MessageSquare, 
  Clock, 
  Tag, 
  Share2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadItem = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const fetchedItem = await getItemById(id);
        setItem(fetchedItem);
      } catch (error) {
        console.error('Erro ao carregar item:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!item || !user) return;
    
    // Verificar se o usuário é o proprietário do item
    if (item.owner.id === user.id) {
      alert('Você não pode iniciar um chat com seu próprio anúncio.');
      return;
    }
    
    try {
      const chat = await createChat(item.id, user);
      navigate(`/mensagens/${chat.id}`);
    } catch (error) {
      console.error('Erro ao iniciar chat:', error);
    }
  };

  const handleShareItem = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: `Confira este item para alugar: ${item?.title}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
      // Fallback para navegadores que não suportam a API de compartilhamento
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copiado para a área de transferência!'))
        .catch((error) => console.error('Erro ao copiar link:', error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container flex items-center justify-center flex-1 px-4 py-8 mx-auto">
          <div className="w-16 h-16 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container flex flex-col items-center justify-center flex-1 px-4 py-8 mx-auto text-center">
          <h1 className="mb-4 text-2xl font-bold">Item não encontrado</h1>
          <p className="mb-6 text-muted-foreground">
            O item que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate('/')}>Voltar para a página inicial</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="container flex-1 px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Coluna da Esquerda - Imagens e Detalhes */}
          <div className="md:col-span-2">
            {/* Galeria de Imagens */}
            <div className="mb-8 overflow-hidden rounded-lg bg-muted">
              {item.images && item.images.length > 0 ? (
                <Carousel>
                  <CarouselContent>
                    {item.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video">
                          <img
                            src={image}
                            alt={`${item.title} - Imagem ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              ) : (
                <div className="flex items-center justify-center aspect-video">
                  <span className="text-muted-foreground">Sem imagens disponíveis</span>
                </div>
              )}
            </div>

            {/* Tabs de Detalhes, Localização */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="location">Localização</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-6 mt-2 rounded-lg border bg-card">
                <h2 className="mb-4 text-2xl font-bold">{item.title}</h2>
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {getCategoryLabel(item.category)}
                  </Badge>
                  
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDistanceToNow(new Date(item.createdAt), { locale: ptBR, addSuffix: true })}
                  </span>
                  
                  <span className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.location.city}, {item.location.state}
                  </span>
                </div>
                
                <div className="p-4 mb-6 rounded-lg bg-muted/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor por dia</p>
                      <p className="text-2xl font-bold text-rent-primary">
                        R$ {item.pricePerDay.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo máximo</p>
                      <p className="text-xl font-medium">
                        {item.maxRentalDays} dias
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-semibold">Descrição</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{item.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Localização</CardTitle>
                    <CardDescription>
                      {item.location.address}, {item.location.city}, {item.location.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MapComponent location={item.location} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Coluna da Direita - Informações do Proprietário e Contato */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Anunciante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={item.owner.avatar} alt={item.owner.name} />
                    <AvatarFallback>{item.owner.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{item.owner.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Membro desde {new Date(item.owner.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleStartChat}
                  disabled={user?.id === item.owner.id}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar mensagem
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" onClick={handleShareItem}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </CardContent>
            </Card>
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

export default ItemDetail;

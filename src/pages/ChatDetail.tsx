
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getChatById, sendMessage } from '@/services/chatService';
import { getItemById } from '@/services/itemService';
import { useUser } from '@/contexts/UserContext';
import { Chat, Item, Message } from '@/types';
import { ArrowLeft, Send, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ChatDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [chat, setChat] = useState<Chat | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Redirecionar para a página de login se o usuário não estiver autenticado
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadChat = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const fetchedChat = await getChatById(id);
        
        if (!fetchedChat) {
          navigate('/mensagens');
          return;
        }
        
        // Verificar se o usuário é participante da conversa
        if (user && !fetchedChat.participants.some(p => p.id === user.id)) {
          navigate('/mensagens');
          return;
        }
        
        setChat(fetchedChat);
        
        // Carregar informações do item
        const fetchedItem = await getItemById(fetchedChat.itemId);
        setItem(fetchedItem);
      } catch (error) {
        console.error('Erro ao carregar conversa:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();
  }, [id, user, navigate]);

  // Rolar para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chat || !user || !message.trim()) return;
    
    setIsSending(true);
    try {
      const newMessage = await sendMessage(chat.id, user, message);
      setChat({
        ...chat,
        messages: [...chat.messages, newMessage],
      });
      setMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Obtém o outro participante da conversa que não é o usuário atual
  const getOtherParticipant = () => {
    if (!chat || !user) return null;
    return chat.participants.find(participant => participant.id !== user.id);
  };

  // Agrupa mensagens por data
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = format(new Date(message.createdAt), 'dd/MM/yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups);
  };

  if (!isAuthenticated) {
    return null; // Não renderizar nada enquanto redireciona
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container flex items-center justify-center flex-1 px-4 py-8 mx-auto">
          <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!chat || !item) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container flex flex-col items-center justify-center flex-1 px-4 py-8 mx-auto text-center">
          <h1 className="mb-4 text-2xl font-bold">Conversa não encontrada</h1>
          <p className="mb-6 text-muted-foreground">
            A conversa que você está procurando não existe ou foi removida.
          </p>
          <Button onClick={() => navigate('/mensagens')}>Voltar para mensagens</Button>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();
  const messageGroups = groupMessagesByDate(chat.messages);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="container grid flex-1 grid-cols-1 gap-6 px-4 py-6 mx-auto md:grid-cols-3">
          {/* Coluna da Esquerda - Detalhes do Item */}
          <div className="hidden md:block">
            <div className="sticky space-y-4 top-20">
              <Card>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">Detalhes do Item</h3>
                  </div>
                  
                  <div className="mb-4 overflow-hidden rounded-md">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="object-cover w-full h-32"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-muted">
                        <span className="text-muted-foreground">Sem imagem</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="mb-2 font-medium">{item.title}</h4>
                  
                  <div className="mb-2 text-lg font-bold text-rent-primary">
                    R$ {item.pricePerDay.toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground">/dia</span>
                  </div>
                  
                  <div className="flex items-center mb-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Máximo: {item.maxRentalDays} dias</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{item.location.city}, {item.location.state}</span>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full text-sm" onClick={() => navigate(`/item/${item.id}`)}>
                      Ver anúncio completo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coluna da Direita - Chat */}
          <div className="md:col-span-2">
            <div className="flex flex-col h-full">
              {/* Cabeçalho do Chat */}
              <div className="flex items-center p-4 mb-4 bg-white rounded-lg shadow-sm">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2" 
                  onClick={() => navigate('/mensagens')}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                
                {otherParticipant && (
                  <>
                    <Avatar className="mr-3">
                      <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                      <AvatarFallback>{otherParticipant.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium">{otherParticipant.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {user?.id === item.owner.id ? 'Interessado no seu item' : 'Proprietário do item'}
                      </p>
                    </div>
                  </>
                )}
                
                <div className="flex items-center ml-auto md:hidden">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/item/${item.id}`)}
                  >
                    Ver item
                  </Button>
                </div>
              </div>
              
              {/* Mensagens */}
              <div className="flex-1 p-4 mb-4 overflow-y-auto bg-white rounded-lg shadow-sm h-[calc(70vh-180px)]">
                {messageGroups.map(([date, messages]) => (
                  <div key={date}>
                    <div className="relative flex items-center justify-center my-4">
                      <div className="absolute w-full border-t border-gray-200"></div>
                      <span className="relative px-2 text-xs text-muted-foreground bg-white">
                        {date}
                      </span>
                    </div>
                    
                    {messages.map((message) => {
                      const isCurrentUser = message.sender.id === user?.id;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isCurrentUser && (
                            <Avatar className="mr-2">
                              <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                              <AvatarFallback>{message.sender.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div
                            className={`max-w-[70%] rounded-lg py-2 px-3 ${
                              isCurrentUser
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {format(new Date(message.createdAt), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Formulário de Envio de Mensagem */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isSending || !message.trim()}>
                  {isSending ? (
                    <span className="w-4 h-4 border-2 rounded-full border-primary-foreground border-t-transparent animate-spin"></span>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatDetail;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { getUserChats } from '@/services/chatService';
import { getItemById } from '@/services/itemService';
import { useUser } from '@/contexts/UserContext';
import { Chat, Item } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [chats, setChats] = useState<Array<Chat & { item?: Item }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirecionar para a página de login se o usuário não estiver autenticado
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadChats = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const fetchedChats = await getUserChats(user.id);
        
        // Carregar informações dos itens para cada chat
        const chatsWithItems = await Promise.all(
          fetchedChats.map(async (chat) => {
            const item = await getItemById(chat.itemId);
            return { ...chat, item };
          })
        );
        
        setChats(chatsWithItems);
      } catch (error) {
        console.error('Erro ao carregar conversas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [user]);

  // Obtém o outro participante da conversa que não é o usuário atual
  const getOtherParticipant = (chat: Chat) => {
    if (!user) return null;
    return chat.participants.find(participant => participant.id !== user.id);
  };

  // Obtém a última mensagem da conversa
  const getLastMessage = (chat: Chat) => {
    if (chat.messages.length === 0) return null;
    return chat.messages[chat.messages.length - 1];
  };

  if (!isAuthenticated) {
    return null; // Não renderizar nada enquanto redireciona
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto">
          <h1 className="mb-6 text-2xl font-bold">Minhas mensagens</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mb-4 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              <p className="text-lg text-gray-500">Você ainda não tem mensagens</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Quando você iniciar conversas com proprietários de itens, elas aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden bg-white rounded-lg shadow">
              <ul className="divide-y">
                {chats.map((chat) => {
                  const otherParticipant = getOtherParticipant(chat);
                  const lastMessage = getLastMessage(chat);
                  
                  if (!otherParticipant || !lastMessage || !chat.item) return null;
                  
                  return (
                    <li 
                      key={chat.id} 
                      className="transition-colors hover:bg-muted/20"
                      onClick={() => navigate(`/mensagens/${chat.id}`)}
                    >
                      <div className="flex items-start p-4 cursor-pointer">
                        <Avatar className="w-12 h-12 mr-4">
                          <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                          <AvatarFallback>{otherParticipant.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h2 className="font-semibold truncate">{otherParticipant.name}</h2>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(lastMessage.createdAt), { 
                                locale: ptBR, 
                                addSuffix: true 
                              })}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage.sender.id === user?.id ? 'Você: ' : ''}{lastMessage.content}
                          </p>
                          
                          <div className="mt-1">
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-muted">
                              {chat.item.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
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

export default ChatList;

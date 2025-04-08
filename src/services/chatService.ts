
import { Chat, Message, User } from '@/types';
import { getItemById } from './itemService';

// Dados mockados para os chats
const mockChats: Chat[] = [
  {
    id: '1',
    itemId: '1',
    participants: [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        phone: '(11) 99999-9999',
        createdAt: new Date('2023-01-15')
      },
      {
        id: '2',
        name: 'Maria Souza',
        email: 'maria@email.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
        phone: '(11) 88888-8888',
        createdAt: new Date('2023-02-20')
      }
    ],
    messages: [
      {
        id: '1',
        chatId: '1',
        sender: {
          id: '2',
          name: 'Maria Souza',
          email: 'maria@email.com',
          avatar: 'https://i.pravatar.cc/150?img=2',
          phone: '(11) 88888-8888',
          createdAt: new Date('2023-02-20')
        },
        content: 'Olá, a câmera está disponível para o próximo final de semana?',
        createdAt: new Date('2023-10-01T10:30:00'),
        read: true
      },
      {
        id: '2',
        chatId: '1',
        sender: {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          avatar: 'https://i.pravatar.cc/150?img=1',
          phone: '(11) 99999-9999',
          createdAt: new Date('2023-01-15')
        },
        content: 'Sim, está disponível! Você pode alugar por até 7 dias.',
        createdAt: new Date('2023-10-01T11:15:00'),
        read: true
      },
      {
        id: '3',
        chatId: '1',
        sender: {
          id: '2',
          name: 'Maria Souza',
          email: 'maria@email.com',
          avatar: 'https://i.pravatar.cc/150?img=2',
          phone: '(11) 88888-8888',
          createdAt: new Date('2023-02-20')
        },
        content: 'Perfeito! Posso pegar na sexta-feira e devolver na segunda?',
        createdAt: new Date('2023-10-01T11:20:00'),
        read: true
      }
    ],
    createdAt: new Date('2023-10-01T10:30:00')
  }
];

export const getUserChats = async (userId: string): Promise<Chat[]> => {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockChats.filter(chat => 
    chat.participants.some(participant => participant.id === userId)
  );
};

export const getChatById = async (chatId: string): Promise<Chat | null> => {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const chat = mockChats.find(chat => chat.id === chatId);
  return chat || null;
};

export const createChat = async (itemId: string, sender: User): Promise<Chat> => {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const item = await getItemById(itemId);
  
  if (!item) {
    throw new Error('Item não encontrado');
  }
  
  // Verificar se já existe um chat para este item e usuário
  const existingChat = mockChats.find(chat => 
    chat.itemId === itemId && 
    chat.participants.some(p => p.id === sender.id) &&
    chat.participants.some(p => p.id === item.owner.id)
  );
  
  if (existingChat) {
    return existingChat;
  }
  
  const newChat: Chat = {
    id: (mockChats.length + 1).toString(),
    itemId,
    participants: [sender, item.owner],
    messages: [],
    createdAt: new Date()
  };
  
  mockChats.push(newChat);
  return newChat;
};

export const sendMessage = async (chatId: string, sender: User, content: string): Promise<Message> => {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const chat = mockChats.find(chat => chat.id === chatId);
  
  if (!chat) {
    throw new Error('Chat não encontrado');
  }
  
  const newMessage: Message = {
    id: (chat.messages.length + 1).toString(),
    chatId,
    sender,
    content,
    createdAt: new Date(),
    read: false
  };
  
  chat.messages.push(newMessage);
  return newMessage;
};

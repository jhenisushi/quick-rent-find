
import { Item, ItemCategory, User, Location } from '@/types';

// Dados mockados para os itens
const mockItems: Item[] = [
  {
    id: '1',
    title: 'Câmera DSLR Canon EOS',
    description: 'Câmera profissional em ótimo estado, ideal para fotografia de eventos. Acompanha lente 18-55mm e carregador.',
    category: 'electronics',
    pricePerDay: 50.00,
    maxRentalDays: 7,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000'
    ],
    location: {
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.550520,
      longitude: -46.633308
    },
    owner: {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      phone: '(11) 99999-9999',
      createdAt: new Date('2023-01-15')
    },
    createdAt: new Date('2023-06-10'),
    available: true
  },
  {
    id: '2',
    title: 'Guitarra Fender Stratocaster',
    description: 'Guitarra em perfeito estado, ideal para shows ou gravações. Acompanha case rígido e cabo.',
    category: 'music',
    pricePerDay: 40.00,
    maxRentalDays: 14,
    images: [
      'https://images.unsplash.com/photo-1525201548942-d8732f6617f0?q=80&w=1000',
      'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1000'
    ],
    location: {
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.561420,
      longitude: -46.655530
    },
    owner: {
      id: '2',
      name: 'Maria Souza',
      email: 'maria@email.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      phone: '(11) 88888-8888',
      createdAt: new Date('2023-02-20')
    },
    createdAt: new Date('2023-07-05'),
    available: true
  },
  {
    id: '3',
    title: 'Drone DJI Mini 2',
    description: 'Drone compacto com câmera 4K, perfeito para filmagens aéreas. Bateria com boa autonomia.',
    category: 'electronics',
    pricePerDay: 80.00,
    maxRentalDays: 5,
    images: [
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=1000',
      'https://images.unsplash.com/photo-1524143986875-3b098d911b9f?q=80&w=1000'
    ],
    location: {
      address: 'Rua Augusta, 500',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.553780,
      longitude: -46.642990
    },
    owner: {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      phone: '(11) 99999-9999',
      createdAt: new Date('2023-01-15')
    },
    createdAt: new Date('2023-08-15'),
    available: true
  },
  {
    id: '4',
    title: 'Bicicleta Mountain Bike',
    description: 'Bicicleta em ótimo estado, ideal para trilhas e passeios. Aro 29, freio a disco.',
    category: 'sports',
    pricePerDay: 35.00,
    maxRentalDays: 10,
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000',
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=1000'
    ],
    location: {
      address: 'Av. Brigadeiro Faria Lima, 2000',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.567690,
      longitude: -46.693190
    },
    owner: {
      id: '2',
      name: 'Maria Souza',
      email: 'maria@email.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      phone: '(11) 88888-8888',
      createdAt: new Date('2023-02-20')
    },
    createdAt: new Date('2023-09-01'),
    available: true
  }
];

export const getItems = async (category?: ItemCategory, query?: string): Promise<Item[]> => {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredItems = [...mockItems];
  
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(searchTerm) || 
      item.description.toLowerCase().includes(searchTerm) ||
      item.location.city.toLowerCase().includes(searchTerm)
    );
  }
  
  return filteredItems;
};

export const getItemById = async (id: string): Promise<Item | null> => {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const item = mockItems.find(item => item.id === id);
  return item || null;
};

export const getUserItems = async (userId: string): Promise<Item[]> => {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockItems.filter(item => item.owner.id === userId);
};

export const createItem = async (
  item: Omit<Item, 'id' | 'createdAt' | 'owner'>, 
  owner: User
): Promise<Item> => {
  // Simulando uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newItem: Item = {
    ...item,
    id: (mockItems.length + 1).toString(),
    owner,
    createdAt: new Date(),
  };
  
  mockItems.push(newItem);
  return newItem;
};

// Categorias disponíveis para os itens
export const itemCategories: { value: ItemCategory; label: string }[] = [
  { value: 'electronics', label: 'Eletrônicos' },
  { value: 'tools', label: 'Ferramentas' },
  { value: 'sports', label: 'Esportes' },
  { value: 'music', label: 'Instrumentos Musicais' },
  { value: 'games', label: 'Jogos' },
  { value: 'books', label: 'Livros' },
  { value: 'vehicles', label: 'Veículos' },
  { value: 'fashion', label: 'Moda' },
  { value: 'party', label: 'Festa' },
  { value: 'home', label: 'Casa' },
  { value: 'other', label: 'Outros' }
];

export const getCategoryLabel = (category: ItemCategory): string => {
  return itemCategories.find(c => c.value === category)?.label || 'Outros';
};

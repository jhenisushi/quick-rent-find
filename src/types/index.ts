
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  pricePerDay: number;
  maxRentalDays: number;
  images: string[];
  location: Location;
  owner: User;
  createdAt: Date;
  available: boolean;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface Chat {
  id: string;
  itemId: string;
  messages: Message[];
  participants: User[];
  createdAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  sender: User;
  content: string;
  createdAt: Date;
  read: boolean;
}

export type ItemCategory = 
  | 'electronics'
  | 'tools'
  | 'sports'
  | 'music'
  | 'games'
  | 'books'
  | 'vehicles'
  | 'fashion'
  | 'party'
  | 'home'
  | 'other';

export interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

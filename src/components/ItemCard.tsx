
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ImageOff } from 'lucide-react';
import { Item } from '@/types';
import { getCategoryLabel } from '@/services/itemService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { id, title, pricePerDay, images, location, category, createdAt } = item;
  const [imageError, setImageError] = useState(false);
  
  // Função para lidar com erros de carregamento de imagem
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <Link to={`/item/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {images && images.length > 0 && !imageError ? (
            <img 
              src={images[0]} 
              alt={title} 
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-100">
              <ImageOff className="w-8 h-8 mb-2" />
              <span className="text-sm">Sem imagem disponível</span>
            </div>
          )}
          <div className="absolute top-0 left-0 px-2 py-1 m-2 text-xs font-medium text-white rounded-md bg-rent-accent">
            {getCategoryLabel(category)}
          </div>
        </div>
        
        <CardContent className="p-4 flex-grow">
          <h3 className="mb-2 text-lg font-semibold line-clamp-1">{title}</h3>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{location.city}, {location.state}</span>
          </div>
          
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{formatDistanceToNow(new Date(createdAt), { locale: ptBR, addSuffix: true })}</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between px-4 py-3 bg-muted/30 mt-auto">
          <div className="text-lg font-bold text-rent-primary">
            R$ {pricePerDay.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">/dia</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ItemCard;

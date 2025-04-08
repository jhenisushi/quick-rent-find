
import React, { useEffect, useRef } from 'react';
import { Location } from '@/types';

interface MapComponentProps {
  location: Location;
  height?: string;
  width?: string;
  zoom?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  location, 
  height = '300px', 
  width = '100%',
  zoom = 15 
}) => {
  // This is a placeholder component that shows the location information
  // A proper implementation would use Mapbox, Leaflet, or Google Maps API
  return (
    <div 
      className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center"
      style={{ height, width }}
    >
      <div className="text-center">
        <p className="font-medium">Localização do item</p>
        <p className="text-sm text-gray-500">{location.address}</p>
        <p className="text-sm text-gray-500">{location.city}, {location.state}</p>
        <p className="text-xs text-gray-400 mt-2">
          Coordenadas: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </p>
        <div className="mt-3">
          <a 
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rent-primary hover:underline text-sm"
          >
            Abrir no Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;

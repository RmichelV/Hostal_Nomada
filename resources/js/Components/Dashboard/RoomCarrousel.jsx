import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function RoomCarousel() {
  const [rooms, setRooms] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  // Fetch room types from the API
  useEffect(() => {
    axios
      .get('/api/roomtypes')
      .then((response) => {
        setRooms(response.data); // Assuming the API returns an array of room types
      })
      .catch((error) => {
        console.error('Error fetching room types:', error);
      });
  }, []);

  const nextSlide = () => {
    setStartIndex((prevIndex) => (prevIndex + 3) % rooms.length);
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) => (prevIndex - 3 + rooms.length) % rooms.length);
  };

  const visibleRooms = [
    rooms[startIndex],
    rooms[(startIndex + 1) % rooms.length],
    rooms[(startIndex + 2) % rooms.length],
  ].filter(Boolean); // Ensure no undefined entries if the API data is less than 3

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8"> {/* Agregamos padding aquí */}
      <div className="flex space-x-4 overflow-hidden">
        {visibleRooms.map((room) => (
          <Card key={room.id} className="flex-shrink-0 w-full sm:w-1/3">
            <CardContent className="p-4">
              <div className="aspect-video mb-4 content-center">
                <img
                  src={room.room_image || '/img/noimage.jpeg?height=200&width=300'}
                  alt={room.name}
                  className="w-80 h-40 content-center object-cover rounded-md"
                />
              </div>
              <h3 className="text-lg font-bold mb-2">{room.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{room.description}</p>
              <p className="text-lg font-semibold">Precio: Bs.{room.price}/noche</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {rooms.length > 3 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

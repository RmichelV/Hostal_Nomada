'use client'

import React, { useState } from 'react'
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const rooms = [
  {
    id: 1,
    name: "Habitación Estándar",
    description: "Cómoda habitación con todas las comodidades básicas.",
    price: 50,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 2,
    name: "Suite de Lujo",
    description: "Espaciosa suite con vistas panorámicas de la ciudad.",
    price: 100,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 3,
    name: "Habitación Familiar",
    description: "Ideal para familias, con espacio para hasta 4 personas.",
    price: 80,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 4,
    name: "Habitación Ejecutiva",
    description: "Perfecta para viajes de negocios, con escritorio y Wi-Fi de alta velocidad.",
    price: 75,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 7,
    name: "Suite Presidencial",
    description: "La más lujosa de nuestras suites, con servicio personalizado.",
    price: 200,
    image: "/placeholder.svg?height=200&width=300"
  }
]

export default function RoomCarousel() {
  const [startIndex, setStartIndex] = useState(0)

  const nextSlide = () => {
    setStartIndex((prevIndex) => (prevIndex + 3) % rooms.length)
  }

  const prevSlide = () => {
    setStartIndex((prevIndex) => (prevIndex - 3 + rooms.length) % rooms.length)
  }

  const visibleRooms = [
    rooms[startIndex],
    rooms[(startIndex + 1) % rooms.length],
    rooms[(startIndex + 2) % rooms.length]
  ]

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      <div className="flex space-x-4 overflow-hidden">
        {visibleRooms.map((room) => (
          <Card key={room.id} className="flex-shrink-0 w-full sm:w-1/3">
            <CardContent className="p-4">
              <div className="aspect-video mb-4 content-center">
                <img
                  src={"/img/noimage.jpeg?height=200&width=300"}
                  alt={room.name}
                  className="w-48 h-auto content-center
                   object-cover rounded-md"
                />
              </div>
              <h3 className="text-lg font-bold mb-2">{room.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{room.description}</p>
              <p className="text-lg font-semibold">Precio: ${room.price}/noche</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
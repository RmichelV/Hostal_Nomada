import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/Components/ui/textarea"
import { Input } from "@/Components/ui/input"

interface Comment {
  id: number;
  name: string;
  comment: string;
  avatar: string;
}

const initialComments: Comment[] = [
  {
    id: 1,
    name: "Maria Garcia",
    comment: "¡Excelente servicio! Las habitaciones son muy cómodas y la ubicación es perfecta.",
    avatar: "/avatars/maria-garcia.jpg"
  },
  {
    id: 2,
    name: "Juan Perez",
    comment: "Me encantó la vista desde mi habitación. El personal fue muy amable y servicial.",
    avatar: "/avatars/juan-perez.jpg"
  },
  {
    id: 3,
    name: "Ana Rodriguez",
    comment: "Un oasis de tranquilidad en el corazón de La Paz. Definitivamente volveré.",
    avatar: "/avatars/ana-rodriguez.jpg"
  }
]

export default function CustomerComments() {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState({ name: '', comment: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.name.trim() && newComment.comment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        name: newComment.name,
        comment: newComment.comment,
        avatar: `/avatars/default-avatar.jpg` // Usar un avatar por defecto
      }
      setComments([...comments, comment])
      setNewComment({ name: '', comment: '' })
    }
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
        
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Lo que dicen nuestros clientes
        </h2>
        <Card className="bg-white dark:bg-gray-700 max-w-2xl mx-auto mb-5">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Añade tu comentario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comentario</label>
                <Textarea
                  id="comment"
                  value={newComment.comment}
                  onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                  placeholder="Escribe tu comentario aquí"
                  required
                />
              </div>
              <Button type="submit">Enviar comentario</Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-white dark:bg-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={comment.avatar} alt={comment.name} />
                    <AvatarFallback>{comment.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">{comment.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{comment.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import Swal from 'sweetalert2';
import { usePage } from '@inertiajs/react';
import { Trash } from 'lucide-react';

interface Comment {
  id: number;
  user_id: number;
  name: string;
  comment: string;
  avatar: string;
}
export default function CustomerComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ comment: '' });
  const { props } = usePage();
  const { auth }: any = props;  // Se asegura de que auth esté disponible desde Inertia.js

  // Cargar comentarios desde el backend al inicio
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('/api/comments'); // Ruta para obtener comentarios
        setComments(
          response.data.map((item: any) => ({
            id: item.id,
            user_id: item.user.id,
            name: item.user.name,
            comment: item.content,
            avatar: item.user.profile_photo_path || '/avatars/default-avatar.jpg',
          }))
        );
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  // Manejar el envío de un nuevo comentario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newComment.comment.trim()) {
      try {
        const response = await axios.post('/api/comments', {
          user_id: auth.user.id,
          content: newComment.comment,
        });
  
        // Mostrar el mensaje de éxito del backend
        Swal.fire("¡Éxito!", response.data.message, "success");
  
        // Agrega el comentario al estado local
        setComments([
          ...comments,
          {
            id: response.data.comment.id,
            name: response.data.comment.user.name,
            comment: response.data.comment.content,
            avatar: response.data.comment.user.profile_photo_path || '/avatars/default-avatar.jpg',
            user_id: auth.user.id,
          },
        ]);
  
        // Limpia el campo de texto después de enviar
        setNewComment({ comment: '' });
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Hubo un problema al agregar tu comentario. Inténtalo nuevamente.';
        Swal.fire('Error', errorMessage, 'error');
      }
    }
  };
  

  // Eliminar un comentario
  const handleDelete = async (commentId: number) => {
    try {
      // Solicitar eliminación del comentario
      const response = await axios.delete(`/api/comments/${commentId}`);
      
      // Verifica que la respuesta sea del tipo esperado
      if (response.status === 200) {
        // Si la respuesta es válida, elimina el comentario del estado local
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
  
        Swal.fire("¡Éxito!", "Comentario eliminado correctamente.", "success");
      } else {
        // Si la respuesta no es 200, muestra un error
        Swal.fire("Error", "No se pudo eliminar el comentario.", "error");
      }
    } catch (error:any) {
      console.error('Error deleting comment:', error);
  
      if (error.response) {
        console.error('Error en la respuesta del servidor:', error.response);
        Swal.fire("Error", "Hubo un problema al eliminar el comentario.", "error");
      } else if (error.request) {
        console.error('Error en la solicitud:', error.request);
        Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
      } else {
        console.error('Error desconocido:', error.message);
        Swal.fire("Error", "Ocurrió un error inesperado.", "error");
      }
    }
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Lo que dicen nuestros clientes
        </h2>

        {/* Formulario para añadir comentario */}
        <Card className="bg-white dark:bg-gray-700 max-w-2xl mx-auto mb-5">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Añade tu comentario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Comentario
                </label>
                <Textarea
                  id="comment"
                  value={newComment.comment}
                  onChange={(e) => setNewComment({ comment: e.target.value })}
                  placeholder="Escribe tu comentario aquí"
                  required
                />
              </div>
              <Button type="submit">Enviar comentario</Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de comentarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-white dark:bg-gray-700 relative">              
            <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={comment.avatar} alt={comment.name} />
                    <AvatarFallback>{comment.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {comment.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{comment.comment}</p>
                
              </CardContent>

              {/* Botón para eliminar solo si el usuario es el propietario del comentario */}
              {
                 comment.user_id === auth.user?.id ? (
                  <Button
                  className="mt-4 absolute bottom-4 right-4 bg-transparent text-slate-500 hover:bg-slate-200"                    variant="destructive"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash />

                  </Button>
                ) : null
              }
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

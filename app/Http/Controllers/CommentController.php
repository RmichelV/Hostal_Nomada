<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comments = Comment::with('user')->get();
        return response()->json($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Verificar si el usuario está autenticado
        if (!Auth::id()) {
            return Inertia::render('Auth/Login');
        }
    
        // Validar la solicitud
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);
    
        // Crear el comentario
        $comment = Comment::create([
            'user_id' => Auth::id(), // Se toma el ID del usuario autenticado
            'content' => $validated['content'],
        ]);
    
        // Cargar la relación con el usuario
        $comment->load('user');
    
        return response()->json([
            'message' => 'Comentario creado exitosamente.',
            'comment' => $comment,
        ], 201);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Verificar si el usuario está autenticado
        if (!Auth::check()) {
            return response()->json(['message' => 'Debes iniciar sesión para realizar esta acción.'], 401);
        }
    
        // Buscar el comentario
        $comment = Comment::find($id);
    
        if (!$comment) {
            return response()->json(['message' => 'El comentario no existe.'], 404);
        }
    
        // Verificar si el usuario es el propietario del comentario
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'No tienes permiso para eliminar este comentario.'], 403);
        }
    
        // Intentar eliminar el comentario
        $comment->delete();
    
        return response()->json(['message' => 'Comentario eliminado exitosamente.'], 200);
    }
    
    
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class UserController extends Controller
{
    public function index()
    {
        return User::with(['country:id,name', 'rol:id,name'])
            ->get();
    }

    public function deletedUsers()
    {
        return User::where('isDeleted', 1)
            ->with(['country:id,name', 'role:id,name'])
            ->get();
    }

    public function store(StoreUserRequest $request)
    {
        try {
            $data = $request->validated();
            $data['name'] = ucwords(strtolower($data['name'])); 
            $data['password'] = Hash::make($data['password']); 
            $user = User::create($data);
            return response()->json($user, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear el usuario',$e], 500);
        }
    }

    public function show(User $user)
    {
        return $user->load(['country:id,name', 'role:id,name']);
    }

    public function update(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:8',
                'country_id' => 'sometimes|required|integer|exists:countries,id',
                'identification_number' => 'sometimes|required|integer|unique:users,identification_number,' . $user->id,
                'birthday' => 'sometimes|required|date',
                'phone' => 'sometimes|required|numeric',
                'rol_id' => 'sometimes|required|integer|exists:rols,id'
            ]);

            $user->update([
                'name' => isset($validated['name']) ? ucwords(strtolower($validated['name'])) : $user->name,
                'email' => $validated['email'] ?? $user->email,
                'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
                'country_id' => $validated['country_id'] ?? $user->country_id,
                'identification_number' => $validated['identification_number'] ?? $user->identification_number,
                'birthday' => $validated['birthday'] ?? $user->birthday,
                'phone' => $validated['phone'] ?? $user->phone,
                'rol_id' => $validated['rol_id'] ?? $user->rol_id,
                'isDeleted' => false
            ]);

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['error' => 'No se pudo actualizar el usuario.',$e], 500);
        }
    }

    public function destroy(User $user)
    {
        try {
            $user->update(['isDeleted' => true]);
            return response()->json(['message' => 'Usuario marcado como eliminado'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el usuario'], 500);
        }
    }
    public function restore($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->isDeleted = false;
            $user->save();
            return response()->json(['message' => 'Usuario restaurado con éxito'], 200);
        }
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

}

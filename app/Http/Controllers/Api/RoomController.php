<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::with('roomType')->get(); 
        return response()->json($rooms);
    }

    public function store(StoreRoomRequest $request)
    {
        $room = Room::create($request->validated());
        return response()->json($room, 201);
    }
    public function update(Request $request, Room $room)
    {
        // Validación de los datos
        $validated = $request->validate([
            'room_type_id' => 'required|exists:room_types,id', // Verifica que el tipo de habitación exista
            'name' => 'required|string|max:25|unique:rooms,name,' . $room->id, // Asegura que el nombre sea único, excepto el actual
            'status' => 'required|in:Ocupada,Libre,No acceso', // Valida el estado de la habitación
        ]);
    
        // Actualiza la habitación con los datos validados
        $room->update($validated);
    
        // Retorna la respuesta con los datos actualizados
        return response()->json($room);
    }
    
    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();
        return response()->json(['message' => 'Room deleted successfully']);
    }
}

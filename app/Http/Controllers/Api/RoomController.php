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
        $request['name'] = ucwords(strtolower($request['name'])); 
        $room = Room::create($request->validated());
        return response()->json($room, 201);
    }
    public function update(Request $request, Room $room)
    {
        // Validación de los datos
        $validated = $request->validate([
            'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'name' => ['required', 'string', 'max:15', 'regex:/^[a-zA-Z][a-zA-Z0-9]*$/','unique:rooms,name,' . $room->id],
            'status' => 'required|in:Ocupada,Libre,No acceso',
        ]);
        $validated['name'] = ucwords(strtolower($validated['name'])); 

        $room->update($validated);
    
        return response()->json($room);
    }
    
    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();
        return response()->json(['message' => 'Room deleted successfully']);
    }
}

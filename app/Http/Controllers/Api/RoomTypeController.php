<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Http\Requests\StoreRoomTypeRequest;
use App\Http\Requests\UpdateRoomTypeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends Controller
{
    public function index()
    {
        return RoomType::all();
    }

    public function store(StoreRoomTypeRequest $request)
    {
        $roomType = new RoomType();
        $roomType->name = $request->input('name');
        $roomType->quantity = $request->input('quantity');
        $roomType->price = $request->input('price');
        $roomType->description = $request->input('description');
        
        if ($request->hasFile('room_image')) {
            $room_image = $request->file('room_image');
            $nombreImagen = $roomType->name . "." . $room_image->extension();
            $ruta = $room_image->storeAs('room_images', $nombreImagen, 'public');
            $roomType->room_image = Storage::url($ruta);

            // $roomType->room_image = $ruta;
        }

        $roomType->save();

        return response()->json($roomType, 201);
    }

    public function show(RoomType $roomType)
    {
        return $roomType;
    }

    public function update(Request $request, RoomType $roomType)
    {
        $request->validate([
            'name' => 'required|string|max:25',
            'quantity' => 'nullable|integer',
            'price' => 'required|numeric|between:1,9999.99',
            'description' => 'required|string|max:55',
        ]);

        $roomType->name = $request->input('name');
        $roomType->quantity = $request->input('quantity');
        $roomType->price = $request->input('price');
        $roomType->description = $request->input('description');

        if ($request->hasFile('room_image')) {
            if ($roomType->room_image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $roomType->room_image));
            }

            $room_image = $request->file('room_image');
            $nombreImagen = $roomType->name . "." . $room_image->extension();
            $ruta = $room_image->storeAs('room_images', $nombreImagen, 'public');
            $roomType->room_image = Storage::url($ruta);
        }

        $roomType->save();

        return response()->json($roomType);
    }

    public function destroy(RoomType $roomType)
    {
        if ($roomType->room_image) {
            Storage::disk('public')->delete($roomType->room_image);
        }

        $roomType->delete();

        return response()->json(['message' => 'Room type deleted successfully.'], 200);
    }
}

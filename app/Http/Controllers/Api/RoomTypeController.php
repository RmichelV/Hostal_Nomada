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
        return RoomType::get();
    }

    // public function store(StoreRoomTypeRequest $request)
    // {
    //     $roomType = new RoomType();
    //     $roomType->name = $request->input('name');
    //     $roomType->quantity = $request->input('quantity');
    //     $roomType->price = $request->input('price');
    //     $roomType->description = $request->input('description');
        
    //     if ($request->hasFile('room_image')) {
    //         $room_image = $request->file('room_image');
    //         $nombreImagen = $roomType->name . "." . $room_image->extension();
    //         $ruta = $room_image->storeAs('room_images', $nombreImagen, 'public');
    //         $roomType->room_image = Storage::url($ruta);

    //         // $roomType->room_image = $ruta;
    //     }

    //     $roomType->save();

    //     return response()->json($roomType, 201);
    // }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:25|unique:room_types,name',
            'quantity' => 'nullable|integer',
            'price' => 'required|numeric|between:1,9999.99',
            'description' => 'required|string|max:100',
            'supplies' => 'nullable|array',
            'supplies.*.name' => 'nullable|string|max:255',
            'supplies.*.quantity' => 'nullable|integer|min:0',
            // Si estás esperando un `id` en los suministros, puedes añadir:
            'supplies.*.id' => 'nullable|exists:supplies,id',
        ]);
    
        // Crear RoomType
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
        }
    
        $roomType->save();
    
        // Asociar suministros
        if ($request->has('supplies')) {
            foreach ($request->input('supplies') as $supplyData) {
                // Si usas `id`, puedes realizar una validación adicional
                $roomType->supplies()->attach($supplyData['id'], ['quantity' => $supplyData['quantity']]);
            }
        }
    
        return response()->json($roomType, 201);
    }
    
    
    public function show(RoomType $roomType)
    {
        $roomType->load(['supplies' => function ($query) {
            $query->select('supplies.id', 'supplies.name', 'room_type_supply.quantity');
        }]);
    
        return response()->json($roomType);    }

    // public function update(Request $request, RoomType $roomType)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:25',
    //         'quantity' => 'nullable|integer',
    //         'price' => 'required|numeric|between:1,9999.99',
    //         'description' => 'required|string|max:55',
    //     ]);

    //     $roomType->name = $request->input('name');
    //     $roomType->quantity = $request->input('quantity');
    //     $roomType->price = $request->input('price');
    //     $roomType->description = $request->input('description');

    //     if ($request->hasFile('room_image')) {
    //         if ($roomType->room_image) {
    //             Storage::disk('public')->delete(str_replace('/storage/', '', $roomType->room_image));
    //         }

    //         $room_image = $request->file('room_image');
    //         $nombreImagen = $roomType->name . "." . $room_image->extension();
    //         $ruta = $room_image->storeAs('room_images', $nombreImagen, 'public');
    //         $roomType->room_image = Storage::url($ruta);
    //     }

    //     $roomType->save();

    //     return response()->json($roomType);
    // }
    public function update(Request $request, RoomType $roomType)
    {
        // Validación
        $request->validate([
            'name' => 'required|string|max:25',
            'quantity' => 'nullable|integer',
            'price' => 'required|numeric|between:1,9999.99',
            'description' => 'required|string|max:100',
            'supplies' => 'nullable|array',
            'supplies.*.id' => 'required|exists:supplies,id',  // Validar que los suministros existan
            'supplies.*.quantity' => 'required|integer|min:1', // Validar la cantidad de los suministros
        ]);

        // Actualizar RoomType
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

        // Actualizar suministros asociados
        if ($request->has('supplies')) {
            $roomType->supplies()->detach();  // Desasociar todos los suministros actuales
            foreach ($request->input('supplies') as $supplyData) {
                $roomType->supplies()->attach($supplyData['id'], ['quantity' => $supplyData['quantity']]);
            }
        }

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

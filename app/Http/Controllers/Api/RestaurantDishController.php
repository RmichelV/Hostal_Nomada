<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RestaurantDish;
use App\Http\Requests\StoreRestaurantDishRequest;
use Illuminate\Support\Facades\Storage;

class RestaurantDishController extends Controller
{
    /**

     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return RestaurantDish::all();
    }

    /**

     * @param  \App\Http\Requests\StoreRestaurantDishRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreRestaurantDishRequest $request)
    {
        $dish = new RestaurantDish();
        $dish->dishname = $request->input('dishname');
        $dish->description = $request->input('description');
        $dish->room_dish = $request->input('room_dish');
        
        // Si se sube una imagen para el plato
        if ($request->hasFile('room_dish')) {
            $roomDishImage = $request->file('room_dish');
            $imageName = $dish->dishname . '.' . $roomDishImage->extension();
            $path = $roomDishImage->storeAs('dish_images', $imageName, 'public');
            $dish->room_dish = Storage::url($path); // Guardar la URL de la imagen
        }

        $dish->save();

        return response()->json($dish, 201);
    }

    /**
     * Mostrar los detalles de un plato.
     *
     * @param  \App\Models\RestaurantDish  $dish
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(RestaurantDish $dish)
    {
        return response()->json($dish);
    }

    /**
     * Actualizar un plato existente.
     *
     * @param  \App\Http\Requests\StoreRestaurantDishRequest  $request
     * @param  \App\Models\RestaurantDish  $dish
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(StoreRestaurantDishRequest $request, RestaurantDish $dish)
    {
        $dish->dishname = $request->input('dishname');
        $dish->description = $request->input('description');
        $dish->room_dish = $request->input('room_dish');

        if ($request->hasFile('room_dish')) {
            if ($dish->room_dish) {
                Storage::disk('public')->delete($dish->room_dish); 
            }

            $roomDishImage = $request->file('room_dish');
            $imageName = $dish->dishname . '.' . $roomDishImage->extension();
            $path = $roomDishImage->storeAs('dish_images', $imageName, 'public');
            $dish->room_dish = Storage::url($path); 
        }

        $dish->save();

        return response()->json($dish);
    }

    public function destroy(RestaurantDish $dish)
    {
        if ($dish->room_dish) {
            Storage::disk('public')->delete($dish->room_dish); // Eliminar la imagen del plato
        }

        $dish->delete();

        return response()->json(['message' => 'Plato eliminado exitosamente'], 200);
    }
}

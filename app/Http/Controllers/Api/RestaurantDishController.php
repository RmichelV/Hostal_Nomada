<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRestaurantDishRequest;
use App\Models\RestaurantDish;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RestaurantDishController extends Controller
{
    public function index()
    {
        return RestaurantDish::get();
    }

    public function store(StoreRestaurantDishRequest $request)
    {
        // $request->validate([
        //     'dishname' => 'required|string|max:25',
        //     'description' => 'required|string|max:55',
        //     'price' => 'required|numeric|between:1,9999.99',
        //     'dish_image' => [
        //     'nullable',
        //     'image', 
        //     'mimes:jpeg,png,jpg,gif', 
        //     'max:2048',
        // ],
        // ]);
        $data = $request->validated();


        $dish = new RestaurantDish();
        $dish->dishname = ucwords(strtolower($data['dishname']));
        $dish->description = ucfirst(($data['description']));
        $dish->price = $data['price'];

        if ($request->hasFile('dish_image')) {
            $image = $request->file('dish_image');
            $imageName = $dish->dishname . "." . $image->extension();
            $path = $image->storeAs('dish_images', $imageName, 'public');
            $dish->dish_image = Storage::url($path);
        }

        $dish->save();

        return response()->json($dish, 201);
    }

    public function show(RestaurantDish $dish)
    {
        return $dish;
    }

    public function update(Request $request, RestaurantDish $dish)
    {
        $request->validate([
            'dishname' => 'required|string|max:25',
            'description' => 'required|string|max:55',
            'price' => ['required', 'numeric', 'regex:/^\d+(\.\d{1,2})?$/','between:1,9999.99'],
'dish_image' => [
            'nullable',
            'image', 
            'mimes:jpeg,png,jpg,gif', 
            'max:2048',
        ],        ]);

        $dish->dishname = ucwords(strtolower($request->input('dishname')));
        $dish->description = ucfirst($request->input('description'));
        $dish->price = $request->input('price');

        if ($request->hasFile('dish_image')) {
            if ($dish->dish_image) {
                // Eliminar la imagen antigua si existe
                Storage::disk('public')->delete(str_replace('/storage/', '', $dish->dish_image));
            }
        
            $image = $request->file('dish_image');
            $imageName = uniqid($dish->dishname . "_") . "." . $image->extension();
            $path = $image->storeAs('dish_images', $imageName, 'public');
            $dish->dish_image = Storage::url($path);
        } elseif ($request->input('dish_image') === '') {
            // Si se envió vacío, asignar null al campo
            $dish->dish_image = null;
        }
        

        $dish->save();

        return response()->json($dish);
    }

    public function destroy(RestaurantDish $dish)
    {
        if ($dish->dish_image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $dish->dish_image));
        }

        $dish->delete();

        return response()->json(['message' => 'Plato eliminado exitosamente.'], 200);
    }
}

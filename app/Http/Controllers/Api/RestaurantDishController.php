<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RestaurantDish;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RestaurantDishController extends Controller
{
    public function index()
    {
        return RestaurantDish::get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'dishname' => 'required|string|max:25',
            'description' => 'required|string|max:55',
            'price' => 'required|numeric|between:1,9999.99',
            'dish_image' => 'nullable|max:2048',
        ]);

        $dish = new RestaurantDish();
        $dish->dishname = $request->input('dishname');
        $dish->description = $request->input('description');
        $dish->price = $request->input('price');

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
            'price' => 'required|numeric|between:1,9999.99',
            'dish_image' => 'nullable|max:2048',
        ]);

        $dish->dishname = $request->input('dishname');
        $dish->description = $request->input('description');
        $dish->price = $request->input('price');

        if ($request->hasFile('dish_image')) {
            if ($dish->dish_image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $dish->dish_image));
            }

            $image = $request->file('dish_image');
            $imageName = $dish->dishname . "." . $image->extension();
            $path = $image->storeAs('dish_images', $imageName, 'public');
            $dish->dish_image = Storage::url($path);
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

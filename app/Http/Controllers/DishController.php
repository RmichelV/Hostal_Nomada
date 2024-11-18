<?php

namespace App\Http\Controllers;

use App\Models\RestaurantDish;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DishController extends Controller
{
    public function showRestaurantPage()
    {
        // Obtener todos los tipos de habitaciones
        $dishes = RestaurantDish::all();

        return Inertia::render('Restaurant/RestaurantDish', [
            'dishes' => $dishes,

        ]);
    }
}

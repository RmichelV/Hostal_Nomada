<?php

namespace App\Http\Controllers;

use App\Models\RestaurantDish;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantHomeController extends Controller
{
    public function showRestaurantPage()
    {
        $dishes = RestaurantDish::all();

        return Inertia::render('Restaurant/Restaurant', [
            'dishes' => $dishes,

        ]);
    }
}
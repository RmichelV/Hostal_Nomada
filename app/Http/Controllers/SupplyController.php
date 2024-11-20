<?php

namespace App\Http\Controllers;

use App\Models\Supply;
use App\Http\Requests\StoreSupplyRequest;
use App\Http\Requests\UpdateSupplyRequest;
use Inertia\Inertia;

class SupplyController extends Controller
{
    public function showSupplyPage()
    {
        // Obtener todos los tipos de habitaciones
        $supplies = Supply::all();

        return Inertia::render('Supply/Supply', [
            'supplies' => $supplies,

        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\RoomType;
use App\Http\Requests\StoreRoomTypeRequest;
use App\Http\Requests\UpdateRoomTypeRequest;
use Inertia\Inertia;

class RoomTypeController extends Controller
{
    public function showRoomTypePage()
    {
        $roomTypes = RoomType::all();

        return Inertia::render('RoomType/RoomType', [
            'roomTypes' => $roomTypes,
        ]);
    }
}

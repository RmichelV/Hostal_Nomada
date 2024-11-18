<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\RoomType;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function showRoomPage()
    {
        $room = Room::with('roomType')->get();
        $roomTypes = RoomType::all();

        return Inertia::render('Room/Room', [
            'room' => $room,
            'roomTypes' => $roomTypes,
        ]);
    }

}

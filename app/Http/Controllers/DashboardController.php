<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Room;

class DashboardController extends Controller
{
    public function getDashboardData(Request $request)
    {
        $userCount = User::where('rol_id', '3')->count();

        $totalReservations = Reservation::count();

        $cancelledReservations = Reservation::where('status', 0)->count();

        $availableRooms = Room::where('status', 'Libre')->count();

        $totalEarnings = Reservation::where('status', '1')->sum('total_price');

        return response()->json([
            'userCount' => $userCount,
            'totalReservations' => $totalReservations,
            'cancelledReservations' => $cancelledReservations,
            'availableRooms' => $availableRooms,
            'totalEarnings' => $totalEarnings,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getDashboardData(Request $request)
    {
        $userCount = User::where('rol_id', '3')->count();

        $totalReservations = Reservation::count();

        $cancelledReservations = Reservation::where('status', 0)->count();

        $availableRooms = Room::where('status', 'Libre')->count();

        $totalEarnings = Reservation::where('status', 'Finalizada')->sum('total_price');

        return response()->json([
            'userCount' => $userCount,
            'totalReservations' => $totalReservations,
            'cancelledReservations' => $cancelledReservations,
            'availableRooms' => $availableRooms,
            'totalEarnings' => $totalEarnings,
        ]);
    }
    public function getComments()
    {
        $comments = DB::table('comments')->join('users', 'comments.user_id', '=', 'users.id')
            ->select('users.name as user_name', 'comments.content', 'comments.c_date')
            ->get();

        return response()->json($comments);
    }

}

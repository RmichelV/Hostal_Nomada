<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    // Mostrar la página de reservas
    public function showReservationPage()
    {

        $roomTypes = RoomType::all();

        return Inertia::render('Reservation/Reservation', [
            'roomTypes' => $roomTypes,
        ]);
    }
    public function showReseListPage()
    {
        $user = Auth::user(); 
    
        if ($user && ($user->rol_id == 1 || $user->rol_id == 8)) {
            $reservations = Reservation::with(['user', 'roomTypes'])  
                ->get();
        } else {
            $reservations = Reservation::with(['user', 'roomTypes'])
                ->where('user_id', $user->id)
                ->get();
        }
        $users = User::where('isDeleted', 0)->get();
        $room_types = RoomType::all();
        return Inertia::render('Reservation/ReservationList', [
            'reservations' => $reservations,  
            'users' => $users,
            'room_types' => $room_types,
        ]);
    
    }
    
    
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function getDashboardData(Request $request)
    {
        $userCount = User::where('rol_id', '3')->count();

        $totalReservations = Reservation::count();

        $cancelledReservations = Reservation::where('status', "Finalizada")->count();

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
    public function report(Request $request)
    {
        // Recibimos los parámetros de búsqueda
        $userSearch = $request->input('user_search', '');
        $supplySearch = $request->input('supply_search', '');
        $reservationSearch = $request->input('reservation_search', '');
    
        // Filtramos los usuarios
        $users = User::where('name', 'like', '%' . $userSearch . '%')
            ->orWhere('email', 'like', '%' . $userSearch . '%')
            ->orWhere('identification_number', 'like', '%' . $userSearch . '%')
            ->orWhere('phone', 'like', '%' . $userSearch . '%')
            ->orWhereHas('country', function ($query) use ($userSearch) {
                $query->where('name', 'like', '%' . $userSearch . '%');
            })
            ->get();
    
        // Filtramos los insumos (supplies)
        $supplies = DB::table('supplies')
            ->select('id', 'name', 'description', 'price', 'supply_image', 'icon')
            ->where('name', 'like', '%' . $supplySearch . '%')
            ->orWhere('description', 'like', '%' . $supplySearch . '%')
            ->orWhere('price', 'like', '%' . $supplySearch . '%')
            ->get();
    
        // Filtramos las reservas (reservations)
        $reservations = DB::table('reservations')
            ->join('users', 'reservations.user_id', '=', 'users.id')
            ->select(
                'reservations.id',
                'users.name as user_name',
                'reservations.number_of_rooms',
                'reservations.number_of_people',
                'reservations.check_in',
                'reservations.check_out',
                'reservations.total_price',
                'reservations.status',
                'reservations.type'
            )
            ->where('users.name', 'like', '%' . $reservationSearch . '%')
            ->orWhere('reservations.number_of_rooms', 'like', '%' . $reservationSearch . '%')
            ->orWhere('reservations.check_in', 'like', '%' . $reservationSearch . '%')
            ->orWhere('reservations.check_out', 'like', '%' . $reservationSearch . '%')
            ->get();
    
        return Inertia::render('Reports', [
            'initialUsers' => $users,
            'initialSupplies' => $supplies,
            'initialReservations' => $reservations,
            'userSearch' => $userSearch,
            'supplySearch' => $supplySearch,
            'reservationSearch' => $reservationSearch,
        ]);
    }
    public function reportpost(Request $request)
    {
        $userSearch = $request->input('user_search', '');
        $supplySearch = $request->input('supply_search', '');
        $reservationSearch = $request->input('reservation_search', '');

        $users = User::where('name', 'like', '%' . $userSearch . '%')
            ->orWhere('email', 'like', '%' . $userSearch . '%')
            ->get();

        $supplies = DB::table('supplies')
            ->where('name', 'like', '%' . $supplySearch . '%')
            ->orWhere('description', 'like', '%' . $supplySearch . '%')
            ->get();

        $reservations = DB::table('reservations')
            ->join('users', 'reservations.user_id', '=', 'users.id')
            ->select(
                'reservations.id',
                'users.name as user_name',
                'reservations.number_of_rooms',
                'reservations.number_of_people',
                'reservations.check_in',
                'reservations.check_out',
                'reservations.total_price'
            )
            ->where('users.name', 'like', '%' . $reservationSearch . '%')
            ->get();

        return response()->json([
            'users' => $users,
            'supplies' => $supplies,
            'reservations' => $reservations,
        ]);
    }
}

<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Models\ReservationRoomType;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Mostrar todas las reservas
     */
    public function index()
    {
        $user = Auth::user();  // Obtener el usuario autenticado
    
        if ($user && ($user->rol_id == 1 || $user->rol_id == 8)) {
            // Si el usuario tiene rol de administrador o un rol especial (1 u 8), mostramos todas las reservas
            $reservations = Reservation::with(['user', 'roomTypes'])  // Cargar los usuarios y tipos de habitación relacionados
                ->get();
        } else {
            // Si no es un administrador, solo mostramos las reservas del usuario autenticado
            $reservations = Reservation::with(['user', 'roomTypes'])
                ->where('user_id', $user->id)
                ->get();
        }
    
        return $reservations; 

    }

    /**
     * Crear una nueva reserva
     */
    public function store(Request $request)
    {
        // Validación de los datos
        $validator = Validator::make($request->all(), [
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after_or_equal:check_in',
            'number_of_people' => 'required|integer|min:1', 
            'rooms' => 'required|array',
            'rooms.*.room_type_id' => 'required|exists:room_types,id', // Validación de ID de habitación
            'rooms.*.quantity' => 'required|integer|min:1', // Validación de cantidad de habitaciones
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validación fallida',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Crear la reserva
            $reservation = Reservation::create([
                'user_id' => Auth::id(),
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'number_of_people' => $request->number_of_people,
            ]);
            // Agregar habitaciones seleccionadas a la reserva
            foreach ($request->rooms as $room) {
                ReservationRoomType::create([
                    'reservation_id' => $reservation->id,
                    'room_type_id' => 1,
                    'quantity' => $room['quantity'],
                ]);
            }
            // // Asociar las habitaciones seleccionadas con la reserva en la tabla pivote
            // foreach ($request->rooms as $room) {
            //     $reservation->roomTypes()->attach($room['room_type_id'], [
            //         'quantity' => $room['quantity'], // Guardar la cantidad de habitaciones seleccionadas
            //     ]);
            // }

            $reservation->total_price = $reservation->calculateTotalPrice();
            $reservation->save(); // Guardar el total del precio

            return response()->json([
                'message' => 'Reserva creada exitosamente',
                'data' => $reservation,
                'rooms' => $reservation->roomTypes, // Retornar las habitaciones asociadas
                'status' => 201,
            ], 201);

        } catch (\Exception $e) {
            // Manejo de excepciones y error
            return response()->json([
                'message' => 'Error al crear la reserva',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Mostrar los detalles de una reserva
     */
    public function show(Reservation $reservation)
    {
        return $reservation->load('roomTypes'); // Cargar las habitaciones asociadas
    }

    /**
     * Actualizar una reserva existente
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {

        if ($request->has('rooms')) {
            $reservation->roomTypes()->detach();
    
            foreach ($request->rooms as $room) {
                ReservationRoomType::create([
                    'reservation_id' => $reservation->id,
                    'room_type_id' => $room['room_type_id'],
                    'quantity' => $room['quantity'],
                ]);
            }
        }
    
        $reservation->total_price = $reservation->calculateTotalPrice();
        $reservation->save();
    
        return response()->json([
            'message' => 'Reserva actualizada exitosamente.',
            'data' => $reservation,
            'status' => 200,
        ], 200);
    }
    

    public function destroy(Reservation $reservation)
{
    if ($reservation->status !== 1) {
        return response()->json([
            'message' => 'Solo se pueden eliminar reservas activas.',
            'status' => 400,
        ], 400);
    }

    $reservation->roomTypes()->detach();

    $reservation->delete();

    return response()->json([
        'message' => 'Reserva eliminada exitosamente.',
        'status' => 200,
    ], 200);
}

}

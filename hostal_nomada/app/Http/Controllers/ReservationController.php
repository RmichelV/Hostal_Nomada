<?php

namespace App\Http\Controllers;

use App\Models\Reservation;

use Illuminate\Http\Request;

//librerias agregadas
use App\Models\Room_type;
use App\Models\User;
use Inertia\Inertia;
use Validator;
use Illuminate\Support\Facades\Auth;
class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Reservation::all();
        $room_types = Room_type::all();
        $users = User::all();

        return Inertia::render('Reservation',['reservations'=>$reservations, 'room_types'=>$room_types, 'users'=>$users]);
        // return view ('Reservation', compact('reservations','room_types','users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'number_of_rooms'=>[
                'integer',
                'regex:/^[0-9]{1,2}$/'
            ],
            'number_of_people'=>[
                'integer',
                'regex:/^[0-9]{1,2}$/'
            ],
            'check_in' => [
                'required',
                'date',
                'after_or_equal:today', 
            ],
            'check_out' => [
                'required',
                'date',
                'after:check_in',
            ]
            
        ],[
            'check_in.required'=>'Debe introducir una fecha',
            'check_in.after_or_equal'=>'La fecha debe ser como minimo hoy o posteior',
            'check_out.after'=>'La fecha ingresada debe ser posterior a la fecha de ingreso'
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $reservation = new Reservation();

        $user_id = Auth::User()->id;
        
        $reservation->user_id = $user_id;
        $reservation->room_type_id = $request->input('room_type_id');
        $reservation->number_of_rooms = $request->input('number_of_rooms');
        $reservation->number_of_people = $request->input('number_of_people');
        $reservation->check_in = $request->input('check_in');
        $reservation->check_out = $request->input('check_out');
        $reservation->total_price = $request->input('total_price');

        $reservation->save();

        return redirect()->back()->with('meesage','habitacion reservada con exito');

    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $reservation = Reservation::find($id);

        $validator = Validator::make($request->all(),[
            'number_of_rooms'=>[
                'integer',
                'regex:/^[0-9]{1,2}$/'
            ],
            'number_of_people'=>[
                'integer',
                'regex:/^[0-9]{1,2}$/'
            ],
            'check_in' => [
                'required',
                'date',
                'after_or_equal:today', 
            ],
            'check_out' => [
                'required',
                'date',
            ]
            
        ],[
            'check_in.required'=>'Debe introducir una fecha',
            'check_in.after_or_equal'=>'La fecha debe ser como minimo hoy o posteior'
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput()
                ->with('modal_id', 'agregar') ; 
        }

        $reservation->user_id = $request->input('user_id');
        $reservation->room_type_id = $request->input('room_type_id');
        $reservation->number_of_rooms = $request->input('number_of_rooms');
        $reservation->number_of_people = $request->input('number_of_people');
        $reservation->check_in = $request->input('check_in');
        $reservation->check_out = $request->input('check_out');
        $reservation->total_price = $request->input('total_price');

        $reservation->update();

        return redirect()->back()->with('meesage','habitacion reservada con exito');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $reservation = Reservation::find($id);
        $reservation->delete();

        return redirect()->back()->with('meesage','habitacion reservada con exito');

    }
    
}

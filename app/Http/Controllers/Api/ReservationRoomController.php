<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReservationRoom;
use App\Http\Requests\StoreReservationRoomRequest;
use App\Http\Requests\UpdateReservationRoomRequest;

class ReservationRoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreReservationRoomRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ReservationRoom $reservationRoom)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReservationRoom $reservationRoom)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRoomRequest $request, ReservationRoom $reservationRoom)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReservationRoom $reservationRoom)
    {
        //
    }
}

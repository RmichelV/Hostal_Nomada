<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Http\Requests\StoreShiftRequest;
use App\Http\Requests\UpdateShiftRequest;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function index()
    {
        return Shift::all();
    }

    public function store(StoreShiftRequest $request)
    {
        $shift = Shift::create($request->validated());
        return response()->json($shift, 201);
    }

    public function show(Shift $shift)
    {
        return $shift;
    }

    public function update(UpdateShiftRequest $request, Shift $shift)
    {
        $shift->update($request->validated());
        return response()->json($shift);
    }

    public function destroy(Shift $shift)
    {
        $shift->delete();
        return response()->json(['message' => 'Shift deleted successfully.'], 200);
    }
}

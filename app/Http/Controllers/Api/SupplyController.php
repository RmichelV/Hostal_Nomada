<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SupplyController extends Controller
{
    public function index()
    {
        return Supply::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:25|unique:supplies,name,',
            'description' => 'nullable|string|max:55',
            'price' => 'required|numeric|between:1,9999.99',
            'supply_image' => 'nullable|max:2048',
        ]);

        $supply = new Supply();
        $supply->name = $request->input('name');
        $supply->description = $request->input('description');
        $supply->price = $request->input('price');

        if ($request->hasFile('supply_image')) {
            $image = $request->file('supply_image');
            $imageName = $supply->name . "." . $image->extension();
            $path = $image->storeAs('supply_images', $imageName, 'public');
            $supply->supply_image = Storage::url($path);
        }

        $supply->save();

        return response()->json($supply, 201);
    }

    public function show(Supply $supply)
    {
        return $supply;
    }

    public function update(Request $request, Supply $supply)
    {

        $request->validate([
            // 'name' => 'required|string|max:25',
            'name' => 'required|string|max:25|unique:supplies,name,' . $supply->id,

            'description' => 'nullable|string|max:55',
            'price' => 'required|numeric|between:1,9999.99',
            'supply_image' => 'nullable|max:2048',
        ]);

        $supply->name = $request->input('name');
        $supply->description = $request->input('description');
        $supply->price = $request->input('price');

        if ($request->hasFile('supply_image')) {
            if ($supply->supply_image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $supply->supply_image));
            }

            $image = $request->file('supply_image');
            $imageName = $supply->name . "." . $image->extension();
            $path = $image->storeAs('supply_images', $imageName, 'public');
            $supply->supply_image = Storage::url($path);
        }

        $supply->save();

        return response()->json($supply);
    }

    public function destroy(Supply $supply)
    {
        if ($supply->supply_image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $supply->supply_image));
        }

        $supply->delete();

        return response()->json(['message' => 'Suministro eliminado exitosamente.'], 200);
    }
}

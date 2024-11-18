<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supply;
use App\Http\Requests\StoreSupplyRequest;
use Illuminate\Support\Facades\Storage;

class SupplyController extends Controller
{
    /**
     * Mostrar todos los suministros.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return Supply::all();
    }

    /**
     * Crear un nuevo suministro.
     *
     * @param  \App\Http\Requests\StoreSupplyRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreSupplyRequest $request)
    {
        $supply = new Supply();
        $supply->dishname = $request->input('dishname');
        $supply->description = $request->input('description');
        $supply->price = $request->input('price');
        
        // Si se sube una imagen para el suministro
        if ($request->hasFile('supply_image')) {
            $supplyImage = $request->file('supply_image');
            $imageName = $supply->dishname . '.' . $supplyImage->extension();
            $path = $supplyImage->storeAs('supply_images', $imageName, 'public');
            $supply->supply_image = Storage::url($path); // Guardar la URL de la imagen
        }

        $supply->save();

        return response()->json($supply, 201);
    }

    /**
     * Mostrar los detalles de un suministro.
     *
     * @param  \App\Models\Supply  $supply
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Supply $supply)
    {
        return response()->json($supply);
    }

    /**
     * Actualizar un suministro existente.
     *
     * @param  \App\Http\Requests\StoreSupplyRequest  $request
     * @param  \App\Models\Supply  $supply
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(StoreSupplyRequest $request, Supply $supply)
    {
        $supply->dishname = $request->input('dishname');
        $supply->description = $request->input('description');
        $supply->price = $request->input('price');

        if ($request->hasFile('supply_image')) {
            if ($supply->supply_image) {
                Storage::disk('public')->delete($supply->supply_image); 
            }

            $supplyImage = $request->file('supply_image');
            $imageName = $supply->dishname . '.' . $supplyImage->extension();
            $path = $supplyImage->storeAs('supply_images', $imageName, 'public');
            $supply->supply_image = Storage::url($path); 
        }

        $supply->save();

        return response()->json($supply);
    }

    /**
     * Eliminar un suministro.
     *
     * @param  \App\Models\Supply  $supply
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Supply $supply)
    {
        if ($supply->supply_image) {
            Storage::disk('public')->delete($supply->supply_image); // Eliminar la imagen del suministro
        }

        $supply->delete();

        return response()->json(['message' => 'Suministro eliminado exitosamente'], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;

//librerias agregadas 
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Redirect;


class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $restaurants = Restaurant::all();

        return Inertia::render('Administration/Restaurant', [
            'restaurants' => $restaurants]);
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
            'name'=>[
                'required',
                'string', 
                'max:255', 
                'unique:'.Restaurant::class,
                'regex:/^([A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)(\s[A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)*$/'],
            'description' => [
                'required',
                'max:255', 
            ]
        ],[
            'name.required'=>'Debe introducir un nombre para el tipo de habitación que se agregará',
            'name.string' => 'El nombre no debe contener números',
            'name.regex' => 'Cada nombre debe comenzar con una letra mayúscula y estar seguido de letras minúsculas.',
            'name.unique' => 'El tipo de habitación que intentaste ingresar ya existe',
            'description.required' => 'Agregue una description por favor',
            'description.max' => 'El campo solo admite hasta 255 caracteres',
        ]); 

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput()
                ->with('modal_id', 'agregar') ; 
        }

        $restaurant = new Restaurant();
        $restaurant->name = $request->input('name');
        $restaurant->description = $request->input('description');

        if ($request->hasFile('food_image')) {
            $food_image = $request->file('food_image');
            $nombreImagen = $restaurant->name . "." . $food_image->extension();
            $ruta = $food_image->storeAs('', $nombreImagen, 'public');
            
            $restaurant->food_image = $ruta; 
        }
        
        $restaurant->save();

        return Redirect::back()->with('message', 'Platillo agregada correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Restaurant $restaurant)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Restaurant $restaurant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $restaurant = Restaurant::find($id);

        $validator = Validator::make($request->all(),[
            'name'=>[
                'required',
                'string', 
                'max:255', 
                Rule::unique('restaurants')->ignore($restaurant->id),
                'regex:/^([A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)(\s[A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)*$/'],
            'description' => [
                'required',
                'max:255', 
            ]
        ],[
            'name.required'=>'Debe introducir un nombre para el tipo de habitación que se agregará',
            'name.string' => 'El nombre no debe contener números',
            'name.regex' => 'Cada nombre debe comenzar con una letra mayúscula y estar seguido de letras minúsculas.',
            'name.unique' => 'El tipo de habitación que intentaste ingresar ya existe',
            'description.required' => 'Agregue una description por favor',
            'description.max' => 'El campo solo admite hasta 255 caracteres',
        ]); 

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput()
                ->with('modal_id', 'editar') ; 
        }
        
        $restaurant->name = $request->input('name');
        $restaurant->description = $request->input('description');

        //eliminar la imagen anterior 
        // if ($request->hasFile('room_image')) {
        //     if ($restaurant->food_image) {
        //         Storage::disk('public')->delete($restaurant->food_image);
        //     }
    
        //     // Procesa la nueva imagen
        //     $restaurant = $request->file('food_image');
        //     $nombreImagen = $restaurant->name. "." . $food_image->extension();
        //     $ruta = $room_image->storeAs('', $nombreImagen, 'public');
            
        //     $room_type->room_image = $ruta; 
        // }
        
        $restaurant->update();

        return Redirect::back()->with('message', 'Plato actualizada correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $restaurant = Restaurant::find($id);

        $restaurant->delete();

        return Redirect::back()->with('message', 'Plato actualizada correctamente');
    }

    
}

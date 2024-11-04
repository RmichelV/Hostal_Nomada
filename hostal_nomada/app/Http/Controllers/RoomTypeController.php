<?php

namespace App\Http\Controllers;

use App\Models\Room_type;
use Illuminate\Http\Request;
use Inertia\Inertia;

//librerias agregadas: 

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Redirect;

class RoomTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $room_types = Room_type::all();

        return Inertia::render('Administration/RoomType', [
            'room_types' => $room_types]);
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
                'unique:'.Room_type::class,
                'regex:/^([A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)(\s[A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)*$/'],
            'quantity'=>[
                'integer',
                'regex:/^[0-9]{1,2}$/'
            ],
            'price' => [
                'required',
                'numeric',
                'regex:/^\d+(\.\d{1,2})?$/',
                'min:25',  
                'max:700', 
            ],
            'description' => [
                'required',
                'max:255'
            ]
        ],[
            'name.required'=>'Debe introducir un nombre para el tipo de habitación que se agregará',
            'name.string' => 'El nombre no debe contener números',
            'name.regex' => 'Cada nombre debe comenzar con una letra mayúscula y estar seguido de letras minúsculas.',
            'name.unique' => 'El tipo de habitación que intentaste ingresar ya existe',
            'quantity.integer' => 'El numero ingresado debe ser entero (Ej. 1, 2, 3, etc)',
            'quantity.regex'=> 'El número ingresado debe estar entre 1 y 99',
            'price.required'=>'por favor introduzca un valor para el precio',
            'price.regex'=>'por favor introduzca un valor con hasta dos decimales',
            'price.min'=>'El precio no debe ser menor a Bs. 25',
            'price.max'=>'El precio no debe ser mayor a Bs. 700',
            'description.required' => 'Agregue una description por favor',
            'description.max' => 'El campo solo admite hasta 255 caracteres',
        ]); 

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput()
                ->with('modal_id', 'agregar') ; 
        }

        $room_type = new Room_type();
        $room_type->name = $request->input('name');
        $room_type->quantity = $request->input('quantity');
        $room_type->price = $request->input('price');
        $room_type->description = $request->input('description');

        if ($request->hasFile('room_image')) {
            $room_image = $request->file('room_image');
            $nombreImagen = $room_type->name . "." . $room_image->extension();
            $ruta = $room_image->storeAs('', $nombreImagen, 'public');
            
            $room_type->room_image = $ruta; 
        }
        
        $room_type->save();

        return Redirect::back()->with('message', 'Habitación agregada correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Room_type $room_type)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room_type $room_type)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, $id)
    // {
    //     $room_type = Room_type::find($id);

    //     $validator = Validator::make($request->all(),[
    //         'name'=>[
    //             'required',
    //             'string', 
    //             'max:255', 
    //             Rule::unique('room_types')->ignore($room_type->id),
    //             'regex:/^([A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)(\s[A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)*$/'],
    //         'quantity'=>[
    //             'integer',
    //             'regex:/^[0-9]{1,2}$/'
    //         ],
    //         'price' => [
    //             'required',
    //             'numeric',
    //             'regex:/^\d+(\.\d{1,2})?$/',
    //             'min:25',  
    //             'max:700', 
    //         ],
    //         'description' => [
    //             'required',
    //             'max:255'
    //         ],
    //     //     'room_image' => [
    //     //     'nullable',
    //     //     'image',
    //     //     'mimes:jpeg,png,jpg,gif,svg',
    //     //     'max:5120'
    //     // ]
    //     ],[
    //         'name.required'=>'Debe introducir un nombre para el tipo de habitación que se agregará',
    //         'name.string' => 'El nombre no debe contener números',
    //         'name.regex' => 'Cada nombre debe comenzar con una letra mayúscula y estar seguido de letras minúsculas.',
    //         'name.unique' => 'El tipo de habitación que intentaste ingresar ya existe',
    //         'quantity.integer' => 'El numero ingresado debe ser entero (Ej. 1, 2, 3, etc)',
    //         'quantity.regex'=> 'El número ingresado debe estar entre 1 y 99',
    //         'price.required'=>'por favor introduzca un valor para el precio',
    //         'price.regex'=>'por favor introduzca un valor con hasta dos decimales',
    //         'price.min'=>'El precio no debe ser menor a Bs. 25',
    //         'price.max'=>'El precio no debe ser mayor a Bs. 700',
    //         'description.required' => 'Agregue una description por favor',
    //         'description.max' => 'El campo solo admite hasta 255 caracteres',
    //     ]); 

    //     if ($validator->fails()) {
    //         return back()
    //             ->withErrors($validator)
    //             ->withInput()
    //             ->with('modal_id', 'editar') ; 
    //     }
        
    //     $room_type->name = $request->input('name');
    //     $room_type->quantity = $request->input('quantity');
    //     $room_type->price = $request->input('price');
    //     $room_type->description = $request->input('description');

    //     //eliminar la imagen anterior 
    //     if ($request->hasFile('room_image')) {
    //         if ($room_type->room_image) {
    //             Storage::disk('public')->delete($room_type->room_image);
    //         }
    
    //         // Procesa la nueva imagen
    //         $room_image = $request->file('room_image');
    //         $nombreImagen = $room_type->name . "." . $room_image->extension();
    //         $ruta = $room_image->storeAs('', $nombreImagen, 'public');
            
    //         $room_type->room_image = $ruta; 
    //     }
        
    //     $room_type->update();

    //     return Redirect::back()->with('message', 'Habitación actualizada correctamente');
    // }
    public function update(Request $request, $id)
{
    $room_type = Room_type::find($id);

    // Validación
    $validator = Validator::make($request->all(), [
        'name' => [
            'required',
            'string',
            'max:255',
            Rule::unique('room_types')->ignore($room_type->id),
            'regex:/^([A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)(\s[A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)*$/'
        ],
        'quantity' => [
            'integer',
            'regex:/^[0-9]{1,2}$/'
        ],
        'price' => [
            'required',
            'numeric',
            'regex:/^\d+(\.\d{1,2})?$/',
            'min:25',
            'max:700',
        ],
        'description' => [
            'required',
            'max:255'
        ],
    ], [
        'name.required' => 'Debe introducir un nombre para el tipo de habitación que se agregará',
        'name.string' => 'El nombre no debe contener números',
        'name.regex' => 'Cada nombre debe comenzar con una letra mayúscula y estar seguido de letras minúsculas.',
        'name.unique' => 'El tipo de habitación que intentaste ingresar ya existe',
        'quantity.integer' => 'El numero ingresado debe ser entero (Ej. 1, 2, 3, etc)',
        'quantity.regex' => 'El número ingresado debe estar entre 1 y 99',
        'price.required' => 'por favor introduzca un valor para el precio',
        'price.regex' => 'por favor introduzca un valor con hasta dos decimales',
        'price.min' => 'El precio no debe ser menor a Bs. 25',
        'price.max' => 'El precio no debe ser mayor a Bs. 700',
        'description.required' => 'Agregue una descripción, por favor',
        'description.max' => 'El campo solo admite hasta 255 caracteres',
    ]);

    if ($validator->fails()) {
        return back()
            ->withErrors($validator)
            ->withInput()
            ->with('modal_id', 'editar');
    }

    // Asignación de valores
    $room_type->name = $request->input('name');
    $room_type->quantity = $request->input('quantity');
    $room_type->price = $request->input('price');
    $room_type->description = $request->input('description');

    // Eliminar la imagen anterior y guardar una nueva si se sube
    if ($request->hasFile('room_image')) {
        if ($room_type->room_image) {
            Storage::disk('public')->delete($room_type->room_image);
        }

        $room_image = $request->file('room_image');
        $uniqueName = $room_type->id . "_" . time() . "." . $room_image->extension();
        $ruta = $room_image->storeAs('', $uniqueName, 'public');

        $room_type->room_image = $ruta;
    }

    // Guardar cambios
    $room_type->update();

    return Redirect::back()->with('message', 'Habitación actualizada correctamente');
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $room_type = Room_type::find($id);

        $room_type->delete();

        return Redirect::back()->with('message', 'Habitación eliminada correctamente');

    }
}

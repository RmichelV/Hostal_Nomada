<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;


//Librerias agregadas
use App\Models\Rol;
use App\Models\Nationality;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $nationalities = Nationality::orderBy('name', 'asc')->get(); 
        return Inertia::render('Auth/Register',['nationalities'=>$nationalities]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(),[
            'name'=>[
                'string', 
                'max:255', 
                'regex:/^([A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)(\s[A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)*$/'],
            'last_name'=>[
                'string', 
                'max:255', 
                'regex:/^([A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)(\s[A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)*$/'],
            'identification_number' => [
                'required',
                'integer',
                'digits_between:6,10',],
            'nationality_id' => [
                'required',
                'exists:nationalities,id'],
            'birthday' => [
                'date',
                function ($attribute, $value, $fail) {
                    $birthday = Carbon::parse($value);
                    $today = Carbon::now();
                    $age = $birthday->age;

                    if ($age < 18) {
                        $fail('Debe tener al menos 18 años.');
                    } elseif ($age > 88) {
                        $fail('Debe tener como máximo 88 años.');
                    }
                },],  
            'phone'=>[
                'nullable',
                'regex:/^[0-9]{6,10}$/'],
            'email' => [
                'required', 
                'string', 
                'lowercase', 
                'email', 
                'max:255', 
                'unique:'.User::class,
                'regex:/^[\w\.-]+@[\w\.-]+\.(com|net|edu)$/'],
            'password' => [
                'required', 
                'confirmed', 
                Rules\Password::defaults(),
                'min:8',
                'regex:/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*()_+\-=\[\]{};:\'"\\|,.<>\/?]).*$/'],
        ],[
            'name.regex' => 'Cada nombre debe comenzar con una letra mayúscula y estar seguido de letras minúsculas.',
            'last_name.regex' => 'Cada apellido debe comenzar con una letra mayúscula y estar seguido de letras minúsculas.',
            'identification_number.integer' => 'El número de identidad debe ser un numero entero',
            'identification_number.digits_between' => 'El número de identidad debe contener entre 6 y 10 dígitos.',
            'nationality_id.exists' => 'La nacionalidad seleccionada no es válida.',
            'birthday.date' => 'La fecha de nacimiento debe ser una fecha válida.',
            'phone.regex' => 'El teléfono debe contener entre 6 y 10 dígitos.',
            'email.email' => 'El correo electrónico debe ser una dirección válida.',
            'email.max' => 'El correo electrónico no debe superar los 255 caracteres.',
            'email.unique' => 'El correo electrónico ya está en uso.',
            'email.regex' => 'El email debe terminar en .com, .net o .edu',
            'password.required' => 'La contraseña es obligatoria.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'password.min'=>'La contraseña debe ser como minimo 8 caracteres',
            'password.regex' => 'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput(); 
        }

        $user = new User();

        $user->name = $request->input('name');
        $user->last_name = $request->input('last_name');
        $user->identification_number = $request->input('identification_number');
        $user->nationality_id = $request->input('nationality_id');
        $user->birthday = $request->input('birthday');
        $user->rol_id = 2;
        $user->phone = $request->input('phone');
        $user->email = $request->input('email');
        $user->password = Hash::make( $request->input('password'));

        $user->save();

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('home', absolute: false));
    }
}

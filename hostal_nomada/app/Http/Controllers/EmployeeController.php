<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

//librerias agregadas 
use App\Models\User;
use App\Models\Shift;
use App\Models\Rol;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use App\Models\Room_type;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::all();
        $users = User::all();
        $rols = Rol::all();
        $shifts = Shift::all();
        
        return Inertia::render('Administration/EmployeeList',['employees'=>$employees,'users'=>$users,'rols'=>$rols,'shifts'=>$shifts]);
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
            'user_id'=>[
                'unique:'.Employee::class,
            ],
            'hire_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $hire_date = Carbon::parse($value);
                    $today = Carbon::now();
                    $twentyYearsAgo = Carbon::now()->subYears(20); // Clonamos la fecha para el límite de 20 años atrás
                    $twoMonthsFromNow = Carbon::now()->addMonths(2); // Clonamos la fecha para el límite de 2 meses en el futuro

                    // Verificar si la fecha de contratación es más antigua de 20 años
                    if ($hire_date < $twentyYearsAgo) {
                        $fail('El empleado debe ser contratado en los últimos 20 años.');
                    }
                    
                    // Verificar si la fecha de contratación está más de 2 meses en el futuro
                    if ($hire_date > $twoMonthsFromNow) {
                        $fail('La fecha de contratación no puede ser mayor a 2 meses en el futuro.');
                    }
                },
            ],

            'salary' => [
                'required',
                'numeric',
                'regex:/^\d+(\.\d{1,2})?$/',
                'min:2500',  
                'max:25000', 
            ],
        ],[
            'hire_date.required'=>'Por favor introduzca una fecha para continuar',
            'hire_date.date'=>'La fecha de contratación no debe superar una antigüedad mayor a la creacióon del hostal o mayor a 2 meses ',
            'salary.required'=>'por favor introduzca un valor para el salario',
            'salary.regex'=>'por favor introduzca un valor con hasta dos decimales',
            'salary.min'=>'El salario no debe ser menor a Bs. 2500 por ley',
            'salary.max'=>'El salario no debe ser mayor a Bs. 25000',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput()
                ->with('modal_id', 'agregar') ; 
        }

        // dd($request->all());

        $employee = new Employee();

        $employee->user_id = $request->input('user_id');
        $employee->hire_date = $request->input('hire_date');
        $employee->shift_id = $request->input('shift_id');
        $employee->salary = $request->input('salary');

        
        $employee->save();

        return redirect()->back()->with('message','Empleado Agregado correctamente');
    }


    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //      'unique:users,email,'.$user->id, 
        $employee = Employee::find($id);

        $validator = Validator::make($request->all(),[
            

            'user_id' => [
        'unique:employees,user_id,' . $employee->id,
    ],
            'hire_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $hire_date = Carbon::parse($value);
                    $today = Carbon::now();
                    $twentyYearsAgo = Carbon::now()->subYears(20); // Clonamos la fecha para el límite de 20 años atrás
                    $twoMonthsFromNow = Carbon::now()->addMonths(2); // Clonamos la fecha para el límite de 2 meses en el futuro

                    // Verificar si la fecha de contratación es más antigua de 20 años
                    if ($hire_date < $twentyYearsAgo) {
                        $fail('El empleado debe ser contratado en los últimos 20 años.');
                    }
                    
                    // Verificar si la fecha de contratación está más de 2 meses en el futuro
                    if ($hire_date > $twoMonthsFromNow) {
                        $fail('La fecha de contratación no puede ser mayor a 2 meses en el futuro.');
                    }
                },
            ],

            'salary' => [
                'required',
                'numeric',
                'regex:/^\d+(\.\d{1,2})?$/',
                'min:2500',  
                'max:25000', 
            ],
        ],[
            'hire_date.required'=>'Por favor introduzca una fecha para continuar',
            'hire_date.date'=>'La fecha de contratación no debe superar una antigüedad mayor a la creacióon del hostal o mayor a 2 meses ',
            'salary.required'=>'por favor introduzca un valor para el salario',
            'salary.regex'=>'por favor introduzca un valor con hasta dos decimales',
            'salary.min'=>'El salario no debe ser menor a Bs. 2500 por ley',
            'salary.max'=>'El salario no debe ser mayor a Bs. 25000',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput()
                ->with('modal_id', 'agregar') ; 
        }

        // dd($request->all());

        $employee->user_id = $request->input('user_id');
        $employee->hire_date = $request->input('hire_date');
        $employee->shift_id = $request->input('shift_id');
        $employee->salary = $request->input('salary');

        
        $employee->update();

        return redirect()->back()->with('message','Empleado actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $employee = Employee::find($id);
        $employee->delete();
        return redirect()->back()->with('message','Empleado eliminado correctamente');
    }
}

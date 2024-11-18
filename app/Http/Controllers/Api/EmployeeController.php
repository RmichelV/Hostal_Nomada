<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class EmployeeController extends Controller
{
    public function index()
    {
        return Employee::where('isDeleted', 0)
        ->whereHas('user', function ($query) {
            $query->where('isDeleted', 0);
        })
        ->with(['user:id,name', 'shift:id,name'])
        ->get();
    
    }

    public function deletedemployees()
    {
        return Employee::where('isDeleted', 1)
            ->with(['user:id,name', 'shift:id,name'])
            ->get();
    }

    public function store(StoreEmployeeRequest $request)
    {
        try {
            $data = $request->validated();
            if (empty($data['user_id'])) {
                $data['user_id'] = Auth::id();
            }

            $employee = Employee::create($data);
            return response()->json($employee, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al crear el empleado'], 500);
        }
    }

    public function show(Employee $employee)
    {
        return $employee;
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        try {
            $employee->update($request->validated());
            return response()->json($employee);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar el empleado'], 500);
        }
    }

    public function destroy(Employee $employee)
    {
        try {
            $employee->update(['isDeleted' => true]);
            return response()->json(['message' => 'Empleado marcado como eliminado'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el empleado'], 500);
        }
    }
}
